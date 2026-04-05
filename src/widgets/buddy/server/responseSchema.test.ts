import test from "node:test";
import assert from "node:assert/strict";
import { parseBuddyModelResponse } from "./responseSchema";

test("parseBuddyModelResponse extracts valid JSON object", () => {
  const parsed = parseBuddyModelResponse(
    'Model output: {"reply":"Hello there!","emotion":"playful","action":"tail_wag"}',
  );

  assert.ok(parsed);
  assert.equal(parsed.reply, "Hello there!");
  assert.equal(parsed.emotion, "playful");
  assert.equal(parsed.action, "tail_wag");
});

test("parseBuddyModelResponse returns null for invalid JSON", () => {
  const parsed = parseBuddyModelResponse("No JSON here");
  assert.equal(parsed, null);
});

test("parseBuddyModelResponse clamps unknown emotion", () => {
  const parsed = parseBuddyModelResponse('{"reply":"hi","emotion":"wild"}');
  assert.ok(parsed);
  assert.equal(parsed.emotion, "curious");
});
