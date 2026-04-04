import { pickBuddyEmotion } from "./deterministic";
import type { BuddyEmotion, BuddyProfile } from "./types";

export interface BuddySessionState {
  profile: BuddyProfile;
  mood: BuddyEmotion;
  interactionCount: number;
  createdAt: number;
  updatedAt: number;
}

export function createBuddySession(profile: BuddyProfile): BuddySessionState {
  const now = Date.now();
  return {
    profile,
    mood: pickBuddyEmotion(profile.visitorId),
    interactionCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateBuddySessionMood(
  state: BuddySessionState,
  mood: BuddyEmotion,
): BuddySessionState {
  return {
    ...state,
    mood,
    interactionCount: state.interactionCount + 1,
    updatedAt: Date.now(),
  };
}
