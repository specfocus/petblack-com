export enum BuddyRarities {
  common = "common",
  uncommon = "uncommon",
  rare = "rare",
  epic = "epic",
  legendary = "legendary",
}

export type BuddyRarity = `${BuddyRarities}`;

export enum BuddySpeciesNames {
  cat = "cat",
  dog = "dog",
  rabbit = "rabbit",
  turtle = "turtle",
  bird = "bird",
  fish = "fish",
  axolotl = "axolotl",
  capybara = "capybara",
}

export type BuddySpecies = `${BuddySpeciesNames}`;

export enum BuddyEmotions {
  happy = "happy",
  curious = "curious",
  playful = "playful",
  sleepy = "sleepy",
  excited = "excited",
}

export type BuddyEmotion = `${BuddyEmotions}`;

export interface BuddyStats {
  patience: number;
  curiosity: number;
  energy: number;
  snark: number;
  empathy: number;
}

export interface BuddyProfile {
  visitorId: string;
  rarity: BuddyRarity;
  species: BuddySpecies;
  name: string;
  personality: string;
  shiny: boolean;
  stats: BuddyStats;
}

export interface BuddyChatInput {
  visitorId: string;
  message: string;
  buddy: BuddyProfile;
  shopSnapshot?: {
    stateValue: string;
    context: unknown;
  };
  shopMachineDoc?: string;
}

export interface BuddyProposedEvent {
  id: string;
  target: "shop";
  eventType: string;
  payload?: Record<string, unknown>;
  reason?: string;
}

export interface BuddyChatOutput {
  reply: string;
  emotion: BuddyEmotion;
  action?: string;
  events?: BuddyProposedEvent[];
  source: "gemini" | "fallback";
}
