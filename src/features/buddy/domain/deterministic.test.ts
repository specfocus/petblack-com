import test from "node:test";
import assert from "node:assert/strict";
import { buildBuddyProfile } from "./deterministic";

test("buildBuddyProfile is deterministic for same seed", () => {
  const first = buildBuddyProfile("visitor-seed-1");
  const second = buildBuddyProfile("visitor-seed-1");
  assert.deepEqual(second, first);
});

test("buildBuddyProfile varies across different seeds", () => {
  const first = buildBuddyProfile("visitor-a");
  const second = buildBuddyProfile("visitor-b");
  assert.notDeepEqual(second, first);
});
