/**
 * Shop Lists — Domain Types
 *
 * A "shop list" is an ordered collection of product SKUs with quantities.
 * Lists come in two flavours:
 *
 *  - **Prefab** — built-in lists that are always available, each with a
 *    fixed semantic meaning and default icon.
 *  - **Custom** — user-created lists, typically named after a specific pet
 *    ("Buddy", "Nemo"), with a freely chosen emoji icon.
 *
 * ## Prefab list semantics
 *
 * | id    | meaning                                    | qty meaning       |
 * |-------|--------------------------------------------|-------------------|
 * | want  | Products the user wants to buy eventually  | desired qty       |
 * | need  | Products the user needs soon               | needed qty        |
 * | have  | Products already in stock at home          | qty on hand       |
 * | cart  | Ready-to-purchase basket (checkout wizard) | qty to buy        |
 * | pick  | Reserve for in-store pickup                | qty to pick up    |
 * | auto  | Autoship / subscription products           | qty per shipment  |
 *
 * Custom lists behave like "want" / "need" — the quantity is buyer intent.
 */

// ── prefab list identifiers ───────────────────────────────────────────────────

export enum PrefabListIds {
    Want = 'want',
    Need = 'need',
    Have = 'have',
    Cart = 'cart',
    Pick = 'pick',
    Auto = 'auto',
}

export type PrefabListId = `${PrefabListIds}`;

// ── list item ─────────────────────────────────────────────────────────────────

export interface ShopListItem {
    /** Product SKU as used in the JSON-LD catalogue */
    sku: string;
    /** Human-readable name (denormalised for display without catalogue lookup) */
    name: string;
    /** Quantity */
    qty: number;
    /** ISO timestamp of when the item was added */
    addedAt: string;
}

// ── list ──────────────────────────────────────────────────────────────────────

export interface ShopList {
    /** Unique identifier — one of PrefabListId or a user-generated UUID */
    id: string;
    /** Display name */
    name: string;
    /**
     * Emoji or icon key used in the FAB and widget header.
     * Prefabs use a fixed default; custom lists let the user pick one.
     */
    icon: string;
    /** Whether this list is currently shown as a widget + dial button */
    enabled: boolean;
    /** true for the 6 built-in lists; false for user-created lists */
    prefab: boolean;
    items: ShopListItem[];
    /** ISO timestamp */
    createdAt: string;
    updatedAt: string;
}

// ── prefab defaults ───────────────────────────────────────────────────────────

export const PREFAB_DEFAULTS: Record<PrefabListId, Pick<ShopList, 'name' | 'icon'>> = {
    [PrefabListIds.Want]: { name: 'Want',      icon: '⭐' },
    [PrefabListIds.Need]: { name: 'Need',      icon: '📋' },
    [PrefabListIds.Have]: { name: 'Have',      icon: '🏠' },
    [PrefabListIds.Cart]: { name: 'Cart',      icon: '🛒' },
    [PrefabListIds.Pick]: { name: 'Pick Up',   icon: '🏪' },
    [PrefabListIds.Auto]: { name: 'Autoship',  icon: '🔄' },
};

// ── pet / animal icon palette for custom lists ────────────────────────────────

export const PET_ICONS: string[] = [
    '🐶', '🐱', '🐰', '🐹', '🐭', '🐮', '🐷',
    '🐸', '🦎', '🐢', '🐍', '🦜', '🐦', '🐟',
    '🐠', '🐡', '🦈', '🐬', '🦦', '🦥', '🦔',
    '🐇', '🐿️', '🦫', '🦭', '🐩', '🦮', '🐈',
    '🐈‍⬛', '🦁', '🐯', '🦊', '🐺',
];
