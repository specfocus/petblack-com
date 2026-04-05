# Buddy Requests Guide

This document explains:

1. what you can ask Buddy **right now**
2. what agent features are **planned next**

---

## What Works Right Now

Buddy currently supports:

- conversational pet-care chat
- short product guidance in natural language
- structured response output (`reply`, `emotion`, optional `action`)
- optional model-proposed `events` in the response payload
- fallback replies when Gemini is unavailable

Important limitation:

- Buddy does **not yet execute actions** on your behalf.
- Proposed events are currently collected/queued in machine state, but not yet policy-gated and dispatched end-to-end.

---

## Requests You Can Make Today

Use plain language. These are good examples:

- "My dog has dry skin, what food ingredients should I avoid?"
- "I have a 2-year-old cat, suggest a simple feeding routine."
- "What are good toys for a high-energy puppy?"
- "Help me compare crate sizes for a medium dog."
- "I need a checklist for bringing home a new rabbit."

You can also ask for shopping intent suggestions (advice-only for now):

- "I need a cute toy for my dog."
- "What should I add to my cart for a new kitten?"
- "Suggest 3 products for dental care."

---

## Debugging Buddy Requests

Use the debug widget at `src/widgets/debug` to inspect raw traffic without browser devtools:

- send raw message to `/api/buddy/chat`
- see full request JSON
- see full response text + parsed payload + status
- verify returned `events` payloads

This is useful while developing the agent workflow.

---

## Current Response Shape

Buddy API currently returns:

```json
{
  "reply": "text for user",
  "emotion": "happy|curious|playful|sleepy|excited",
  "action": "optional_short_action",
  "events": [
    {
      "id": "event-id",
      "target": "shop",
      "eventType": "shop.someEvent",
      "payload": {},
      "reason": "optional rationale"
    }
  ],
  "source": "gemini|fallback"
}
```

---

## Planned Features (Next)

### 1) Full Event-Driven Agent Execution

- `agent-machine` orchestrates multi-step tasks
- `shop-machine` owns shop state and user interactions
- `storage-machine` contract with swappable implementation (`local-storage-machine` now, backend later)

### 2) Safe Action Policy Gate

For each proposed action:

- **Accept**: run once
- **Always**: add to allowlist and auto-run next time
- **Cancel**: reject once
- **Never**: add to denylist and block next time

### 3) Multi-Stage Agent Loops

Example target flow:

1. user: "add a cute toy to cart"
2. agent sends search event
3. shop/storage returns results
4. agent sends updated context back to model
5. model picks item
6. agent proposes/adds item to cart (with policy checks)

### 4) Better Shell Integration

- shop machine receives shell feedback (active view, breadcrumbs)
- next step: explicit shop-driven shell commands where needed

---

## Environment Notes

- `GEMINI_API_KEY` required for live model replies
- fallback mode remains available when Gemini is unavailable

