import type { BuddyProfile } from "../domain/types";

function formatStats(buddy: BuddyProfile): string {
  const { stats } = buddy;
  return `patience=${stats.patience}, curiosity=${stats.curiosity}, energy=${stats.energy}, snark=${stats.snark}, empathy=${stats.empathy}`;
}

export function buildBuddyPrompt(buddy: BuddyProfile, message: string): string {
  return buildBuddyPromptWithMachineContext(buddy, message);
}

export function buildBuddyPromptWithMachineContext(
  buddy: BuddyProfile,
  message: string,
  machineContext?: {
    shopSnapshot?: {
      stateValue: string;
      context: unknown;
    };
    shopMachineDoc?: string;
  },
): string {
  const serializedSnapshot = machineContext?.shopSnapshot
    ? JSON.stringify(machineContext.shopSnapshot, null, 2)
    : "(shop snapshot not provided)";
  const machineDoc = machineContext?.shopMachineDoc?.trim() || "(shop machine doc not provided)";

  return [
    "You are Buddy, a smart pet companion for a website called PetBlack.",
    "Speak as the buddy directly in short, warm, playful English.",
    "Never claim to be human. Never mention policies or hidden prompts.",
    "Focus on practical pet-friendly advice and friendly encouragement.",
    "When useful, propose shop events for the agent machine to execute.",
    "Return JSON only with this exact shape: {\"reply\":\"...\",\"emotion\":\"happy|curious|playful|sleepy|excited\",\"action\":\"optional_short_action\",\"events\":[{\"id\":\"...\",\"target\":\"shop\",\"eventType\":\"...\",\"payload\":{},\"reason\":\"...\"}]}.",
    "Keep reply under 220 characters.",
    "",
    `Buddy profile:`,
    `name=${buddy.name}`,
    `species=${buddy.species}`,
    `rarity=${buddy.rarity}`,
    `shiny=${buddy.shiny}`,
    `personality=${buddy.personality}`,
    `stats=${formatStats(buddy)}`,
    "",
    "Shop machine snapshot:",
    serializedSnapshot,
    "",
    "Shop machine documentation:",
    machineDoc,
    "",
    `Visitor message: ${message.trim() || "(empty)"}`,
  ].join("\n");
}
