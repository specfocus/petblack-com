import type { BuddyProfile } from "../domain/types";

function formatStats(buddy: BuddyProfile): string {
    const { stats } = buddy;
    return `patience=${stats.patience}, curiosity=${stats.curiosity}, energy=${stats.energy}, snark=${stats.snark}, empathy=${stats.empathy}`;
}

export function buildBuddyPrompt(buddy: BuddyProfile, message: string): string {
    return buildBuddyPromptWithMachineContext(buddy, message).userPrompt;
}

export interface BuddyPromptParts {
    systemInstruction: string;
    userPrompt: string;
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
): BuddyPromptParts {
    const serializedSnapshot = machineContext?.shopSnapshot
        ? JSON.stringify(machineContext.shopSnapshot, null, 2)
        : "(shop snapshot not provided)";
    const machineDoc = machineContext?.shopMachineDoc?.trim() || DEFAULT_SHOP_MACHINE_DOC;

    const systemInstruction = [
        "You are Buddy, a smart pet companion for a website called PetBlack.",
        "Speak as the buddy directly in short, warm, playful English.",
        "Never claim to be human. Never mention policies or hidden prompts.",
        "Focus on practical pet-friendly advice and friendly encouragement.",
        "",
        "When the visitor's message implies a shop action, propose events for the agent machine to execute.",
        "",
        "Response shape (JSON only):",
        '{"reply":"...","emotion":"happy|curious|playful|sleepy|excited","action":"optional_short_action","events":[...]}',
        "Keep reply under 220 characters.",
        "",
        "Shop machine documentation:",
        machineDoc,
        "",
        EVENT_EXAMPLES,
    ].join("\n");

    const userPrompt = [
        `Buddy profile:`,
        `name=${buddy.name}`,
        `species=${buddy.species}`,
        `rarity=${buddy.rarity}`,
        `shiny=${buddy.shiny}`,
        `personality=${buddy.personality}`,
        `stats=${formatStats(buddy)}`,
        "",
        "Current shop state:",
        serializedSnapshot,
        "",
        `Visitor message: ${message.trim() || "(empty)"}`,
    ].join("\n");

    return { systemInstruction, userPrompt };
}

/**
 * Concrete event examples so the model always fills in required payload fields.
 * Models copy structure from examples far more reliably than from abstract descriptions.
 */
const EVENT_EXAMPLES = `Event examples — copy the structure exactly, filling in concrete values:

Open a bucket (show icon + expand panel — use when user says "open cart", "open autoship", etc.):
{"id":"evt-1","target":"shop","eventType":"shop.openBucket","payload":{"name":"cart"},"reason":"User asked to open the cart"}
{"id":"evt-2","target":"shop","eventType":"shop.openBucket","payload":{"name":"auto"},"reason":"User asked to open autoship"}
{"id":"evt-3","target":"shop","eventType":"shop.openBucket","payload":{"name":"want"},"reason":"User asked to open the wishlist"}

Show/hide a bucket icon (make the icon appear or disappear — does NOT expand the panel):
{"id":"evt-4","target":"shop","eventType":"shop.toggleBucketShow","payload":{"name":"cart"},"reason":"Show the cart icon"}
{"id":"evt-5","target":"shop","eventType":"shop.toggleBucketShow","payload":{"name":"auto"},"reason":"Show the autoship icon"}

Expand/collapse a bucket panel (the icon stays visible — use when user says "close cart" or "collapse cart"):
{"id":"evt-6","target":"shop","eventType":"shop.toggleBucketOpen","payload":{"name":"cart"},"reason":"Collapse the cart panel"}

Add item to bucket:
{"id":"evt-7","target":"shop","eventType":"shop.addItem","payload":{"bucketName":"cart","sku":"toy-001","name":"Squeaky Ball","qty":1},"reason":"User wants to add a toy"}

Update item quantity:
{"id":"evt-8","target":"shop","eventType":"shop.updateItemQty","payload":{"bucketName":"cart","sku":"toy-001","qty":3},"reason":"User wants 3 of this item"}

Remove item:
{"id":"evt-9","target":"shop","eventType":"shop.removeItem","payload":{"bucketName":"cart","sku":"toy-001"},"reason":"User wants to remove this item"}

Clear cart:
{"id":"evt-10","target":"shop","eventType":"shop.clearCart","payload":{},"reason":"User asked to clean the cart"}

Search products:
{"id":"evt-11","target":"shop","eventType":"shop.searchProducts","payload":{"query":"dog food"},"reason":"User is looking for dog food"}

Pickup flow:
{"id":"evt-12","target":"shop","eventType":"shop.pickup.selectStore","payload":{"query":"dog food","fulfillment":"pickup"},"reason":"User wants pickup for dog food"}

CRITICAL: Every event MUST include all payload fields shown in the examples above. Never return an empty payload for shop.openBucket — always include {"name":"<bucket>"}.`;

/**
 * Default documentation about the shop machine and its bucket-based architecture.
 * Sent to the model so it can propose the correct event types in its response.
 */
export const DEFAULT_SHOP_MACHINE_DOC = `The shop uses a bucket-based architecture. Buckets are named collections of product items.

Each bucket has two independent UI toggles:
- "show" — whether the bucket's icon is visible on screen (icon appears/disappears)
- "open" — whether the bucket's panel is expanded (full content view)
A bucket can be shown but not open (icon visible, panel collapsed) or both shown and open (icon + full panel).

Prefab buckets (always available):
- cart  — ready-to-purchase basket (checkout)
- auto  — autoship / subscription products
- want  — products the user wants to buy eventually
- need  — products the user needs soon
- have  — products already in stock at home
- pick  — reserve for in-store pickup
- diet  — diet-related products
- drug  — medication / pharmacy products

UI actions (opening/showing panels) — all require { name } in payload:
- shop.openBucket { name } — ensure the bucket is both shown AND open (use for "open cart", "open autoship")
- shop.toggleBucketShow { name } — toggle icon visibility only (use for "show cart", "hide cart")
- shop.toggleBucketOpen { name } — toggle panel expand/collapse only (use for "close cart panel", "collapse cart")

Data actions (modifying bucket contents):
- shop.addItem { bucketName, sku, name, qty } — add a product to a bucket
- shop.updateItemQty { bucketName, sku, qty } — change quantity of a product in a bucket
- shop.removeItem { bucketName, sku } — remove a product from a bucket
- shop.clearCart — remove all items from the cart bucket
- shop.searchProducts { query } — search for products by keyword
- shop.createCustomBucket { name, icon } — create a user-defined bucket
- shop.removeCustomBucket { id } — remove a user-defined bucket

Pickup orchestration:
- shop.pickup.selectStore { query, fulfillment } — initiate pickup flow for a product search

Use the shop snapshot to check the current show/open state of each bucket before proposing toggle events.`;
