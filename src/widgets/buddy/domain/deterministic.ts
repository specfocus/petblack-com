import {
  BuddyEmotions,
  BuddyRarities,
  BuddySpeciesNames,
  type BuddyEmotion,
  type BuddyProfile,
  type BuddyRarity,
  type BuddySpecies,
  type BuddyStats,
} from "./types";

const SPECIES: BuddySpecies[] = Object.values(BuddySpeciesNames);
const RARITIES: BuddyRarity[] = Object.values(BuddyRarities);
const EMOTIONS: BuddyEmotion[] = Object.values(BuddyEmotions);

const RARITY_WEIGHTS: Record<BuddyRarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
};

const BASE_NAMES = [
  "Nova",
  "Milo",
  "Pebble",
  "Zuzu",
  "Lumi",
  "Taco",
  "Onyx",
  "Poppy",
  "Nori",
  "Biscuit",
];

const PERSONALITY_TRAITS = [
  "protective but goofy",
  "curious and chatty",
  "calm and observant",
  "dramatic in a funny way",
  "tiny but surprisingly wise",
  "playful and slightly chaotic",
];

const RARITY_FLOOR: Record<BuddyRarity, number> = {
  common: 25,
  uncommon: 35,
  rare: 45,
  epic: 55,
  legendary: 65,
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return function next() {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(random: () => number, list: readonly T[]): T {
  return list[Math.floor(random() * list.length)]!;
}

function rollRarity(random: () => number): BuddyRarity {
  const total = RARITIES.reduce((sum, rarity) => sum + RARITY_WEIGHTS[rarity], 0);
  let roll = random() * total;
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity];
    if (roll < 0) {
      return rarity;
    }
  }
  return BuddyRarities.common;
}

function rollStats(random: () => number, rarity: BuddyRarity): BuddyStats {
  const floor = RARITY_FLOOR[rarity];
  const bonus = Math.floor(random() * 30);
  return {
    patience: Math.min(100, floor + Math.floor(random() * 30)),
    curiosity: Math.min(100, floor + Math.floor(random() * 30)),
    energy: Math.min(100, floor + Math.floor(random() * 30)),
    snark: Math.min(100, floor + Math.floor(random() * 30)),
    empathy: Math.min(100, floor + bonus),
  };
}

function normalizeSeed(seed: string): string {
  return seed.trim().toLowerCase();
}

export function buildBuddyProfile(seed: string): BuddyProfile {
  const normalized = normalizeSeed(seed);
  const random = mulberry32(hashString(`petblack-buddy:${normalized}`));
  const rarity = rollRarity(random);
  const species = pickOne(random, SPECIES);
  const baseName = pickOne(random, BASE_NAMES);
  const suffix = `${Math.floor(random() * 90) + 10}`;
  const trait = pickOne(random, PERSONALITY_TRAITS);
  const shiny = random() < 0.01;

  return {
    visitorId: normalized,
    rarity,
    species,
    name: `${baseName}${suffix}`,
    personality: `${trait}. Loves helping pet visitors pick the right companion care tips.`,
    shiny,
    stats: rollStats(random, rarity),
  };
}

export function pickBuddyEmotion(seed: string): BuddyEmotion {
  const normalized = normalizeSeed(seed);
  const random = mulberry32(hashString(`petblack-emotion:${normalized}`));
  return pickOne(random, EMOTIONS);
}
