import { NextResponse } from "next/server";
import { buildFallbackBuddyReply } from "@/widgets/buddy/server/fallback";
import { generateBuddyResponseWithGemini, hasGeminiConfig } from "@/widgets/buddy/server/geminiClient";
import { buildBuddyPromptWithMachineContext } from "@/widgets/buddy/server/promptBuilder";
import { parseBuddyModelResponse } from "@/widgets/buddy/server/responseSchema";
import type { BuddyChatInput, BuddyProfile } from "@/widgets/buddy/domain/types";

const MAX_MESSAGE_LENGTH = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;
const rateLimitStore = new Map<string, { count: number; startedAt: number; }>();

function normalizeMessage(input: string): string {
    return input.replace(/\s+/g, " ").trim().slice(0, MAX_MESSAGE_LENGTH);
}

function isBuddyProfile(input: unknown): input is BuddyProfile {
    if (!input || typeof input !== "object") {
        return false;
    }
    const candidate = input as Record<string, unknown>;
    return (
        typeof candidate.visitorId === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.species === "string" &&
        typeof candidate.rarity === "string" &&
        typeof candidate.personality === "string" &&
        typeof candidate.shiny === "boolean" &&
        typeof candidate.stats === "object" &&
        candidate.stats !== null
    );
}

function isBuddyChatInput(input: unknown): input is BuddyChatInput {
    if (!input || typeof input !== "object") {
        return false;
    }
    const candidate = input as Record<string, unknown>;
    return (
        typeof candidate.visitorId === "string" &&
        typeof candidate.message === "string" &&
        isBuddyProfile(candidate.buddy) &&
        (
            typeof candidate.shopSnapshot === 'undefined' ||
            (
                candidate.shopSnapshot !== null &&
                typeof candidate.shopSnapshot === 'object' &&
                typeof (candidate.shopSnapshot as Record<string, unknown>).stateValue === 'string'
            )
        ) &&
        (
            typeof candidate.shopMachineDoc === 'undefined' ||
            typeof candidate.shopMachineDoc === 'string'
        )
    );
}

function getClientKey(req: Request): string {
    const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = req.headers.get("x-real-ip")?.trim();
    return forwardedFor || realIp || "unknown-client";
}

function isRateLimited(clientKey: string): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(clientKey);
    if (!entry || now - entry.startedAt > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.set(clientKey, { count: 1, startedAt: now });
        return false;
    }
    entry.count += 1;
    return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: Request) {
    const clientKey = getClientKey(req);
    if (isRateLimited(clientKey)) {
        return NextResponse.json(
            { error: "Rate limit exceeded. Please wait a minute and try again." },
            { status: 429 },
        );
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    if (!isBuddyChatInput(body)) {
        return NextResponse.json({ error: "Invalid buddy chat payload." }, { status: 400 });
    }

    const input: BuddyChatInput = {
        ...body,
        message: normalizeMessage(body.message),
    };

    if (!input.message) {
        return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const isDev = process.env.NODE_ENV !== "production";
    const withDebug = (payload: object, reason: string) =>
        NextResponse.json(isDev ? { ...payload, debugReason: reason } : payload);

    if (!hasGeminiConfig()) {
        return withDebug(buildFallbackBuddyReply(input.buddy, input.message, "missing_gemini"), "missing_gemini");
    }

    try {
        const prompt = buildBuddyPromptWithMachineContext(input.buddy, input.message, {
            shopSnapshot: input.shopSnapshot,
            shopMachineDoc: input.shopMachineDoc,
        });
        const gemini = await generateBuddyResponseWithGemini(prompt);
        const raw = gemini.text;
        const parsed = parseBuddyModelResponse(raw);

        if (!parsed) {
            const debugRaw = isDev ? raw.slice(0, 400) : undefined;
            return withDebug(
                {
                    ...buildFallbackBuddyReply(input.buddy, input.message, "invalid_model_json"),
                    ...(isDev ? { debugModel: gemini.model } : {}),
                    ...(debugRaw ? { debugRaw } : {}),
                },
                "invalid_model_json",
            );
        }

        return NextResponse.json({
            ...parsed,
            ...(isDev ? { debugModel: gemini.model } : {}),
            source: "gemini",
        });
    } catch (error) {
        const reason =
            error instanceof Error ? `gemini_error:${error.message}` : "gemini_error:unknown";
        return withDebug(buildFallbackBuddyReply(input.buddy, input.message, reason), reason);
    }
}
