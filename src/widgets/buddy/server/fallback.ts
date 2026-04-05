import { BuddyEmotions, type BuddyChatOutput, type BuddyProfile } from "../domain/types";

const FALLBACK_LINES = [
  "I am sniffing around for tips. Tell me what pet you are caring for!",
  "Paws up. I can help with quick care ideas and product picks.",
  "Tail wiggle mode activated. Ask me about feeding, play, or comfort.",
  "I am here for your pet questions. Let us find a kind next step.",
];

function pickFallbackLine(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_LINES[hash % FALLBACK_LINES.length]!;
}

export function buildFallbackBuddyReply(
  buddy: BuddyProfile,
  message: string,
  reason: string,
): BuddyChatOutput {
  const prompt = message.trim();
  const prefix = prompt
    ? `${buddy.name} heard: "${prompt.slice(0, 80)}".`
    : `${buddy.name} is ready.`;

  return {
    reply: `${prefix} ${pickFallbackLine(`${buddy.visitorId}:${reason}`)}`,
    emotion: BuddyEmotions.curious,
    action: "tail_wag",
    events: [],
    source: "fallback",
  };
}
