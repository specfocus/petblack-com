const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-2.5-pro"] as const;

interface GeminiGenerateResponse {
  candidates?: Array<{
    finishReason?: string;
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function hasGeminiConfig(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export type GeminiBuddyResponse = {
  text: string;
  model: string;
};

export async function generateBuddyResponseWithGemini(
  prompt: string,
): Promise<GeminiBuddyResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const modelsToTry = [getGeminiModel(), ...FALLBACK_MODELS];
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError: Error | null = null;
  for (const model of uniqueModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          top_k: 40,
          top_p: 0.95,
          max_output_tokens: 200,
          // Prevent long hidden reasoning from consuming output budget.
          thinking_config: {
            thinking_budget: 0,
          },
          response_mime_type: "application/json",
          response_schema: {
            type: "OBJECT",
            properties: {
              reply: { type: "STRING" },
              emotion: { type: "STRING" },
              action: { type: "STRING" },
            },
            required: ["reply", "emotion"],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      const message = errorBody?.error?.message ?? response.statusText;
      lastError = new Error(
        `Gemini request failed (${response.status}) for model ${model}: ${message}`,
      );
      if (response.status === 404 || response.status === 429) {
        continue;
      }
      throw lastError;
    }

    const json = (await response.json()) as GeminiGenerateResponse;
    const finishReason = json.candidates?.[0]?.finishReason;
    const text = json.candidates?.[0]?.content?.parts?.map(part => part.text ?? "").join("").trim();
    if (!text) {
      lastError = new Error(
        `Gemini returned no text for model ${model}${
          finishReason ? ` (finishReason=${finishReason})` : ""
        }`,
      );
      continue;
    }
    return { text, model };
  }

  throw lastError ?? new Error("Gemini request failed for all configured models");
}
