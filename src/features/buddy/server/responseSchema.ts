import { BuddyEmotions, type BuddyChatOutput, type BuddyEmotion } from "../domain/types";

const MAX_REPLY_LENGTH = 240;

function extractJsonObject(raw: string): string | null {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) {
        return fenced[1].trim();
    }

    const trimmed = raw.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        return trimmed;
    }

    const start = raw.indexOf("{");
    if (start < 0) return null;
    let depth = 0;
    for (let index = start;index < raw.length;index += 1) {
        const char = raw[index];
        if (char === "{") depth += 1;
        if (char === "}") {
            depth -= 1;
            if (depth === 0) {
                return raw.slice(start, index + 1);
            }
        }
    }
    return null;
}

function toEmotion(input: unknown): BuddyEmotion {
    const value = typeof input === "string" ? input.toLowerCase().trim() : "";
    const emotions: BuddyEmotion[] = Object.values(BuddyEmotions);
    if (emotions.includes(value as BuddyEmotion)) {
        return value as BuddyEmotion;
    }
    return BuddyEmotions.curious;
}

function toReply(input: unknown): string | null {
    if (typeof input !== "string") {
        return null;
    }

    const cleaned = input.replace(/\s+/g, " ").trim();
    if (!cleaned) {
        return null;
    }
    if (cleaned.length > MAX_REPLY_LENGTH) {
        return `${cleaned.slice(0, MAX_REPLY_LENGTH - 1)}…`;
    }
    return cleaned;
}

export function parseBuddyModelResponse(rawText: string): Omit<BuddyChatOutput, "source"> | null {
    const jsonText = extractJsonObject(rawText);
    if (!jsonText) {
        return null;
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonText);
    } catch {
        return null;
    }

    if (!parsed || typeof parsed !== "object") {
        return null;
    }

    const candidate = parsed as { reply?: unknown; emotion?: unknown; action?: unknown; };
    const reply = toReply(candidate.reply);
    if (!reply) {
        return null;
    }

    return {
        reply,
        emotion: toEmotion(candidate.emotion),
        action: typeof candidate.action === "string" ? candidate.action.trim() : undefined,
    };
}
