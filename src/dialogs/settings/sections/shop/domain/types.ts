/**
 * Shop Lists — Domain Types
 *
 * A "shop bucket" is an ordered collection of product SKUs with quantities.
 * Lists come in two flavours:
 *
 *  - **Prefab** — built-in buckets that are always available, each with a
 *    fixed semantic meaning and default icon.
 *  - **Custom** — user-created buckets, typically named after a specific pet
 *    ("Buddy", "Nemo"), with a freely chosen emoji icon.
 *
 * ## Prefab bucket semantics
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
 * Custom buckets behave like "want" / "need" — the quantity is buyer intent.
 */

// ── prefab bucket names ───────────────────────────────────────────────────

export enum PrefabBucketNames {
    Want = 'want',
    Need = 'need',
    Have = 'have',
    Cart = 'cart',
    Pick = 'pick',
    Auto = 'auto',
}

export type PrefabBucketName = `${PrefabBucketNames}`;

// ── bucket item ─────────────────────────────────────────────────────────────────

export interface BucketItem {
    /** Product SKU as used in the JSON-LD catalogue */
    sku: string;
    /** Human-readable name (denormalised for display without catalogue lookup) */
    name: string;
    /** Quantity */
    qty: number;
    /** ISO timestamp of when the item was added */
    addedAt: string;
}

// ── bucket ──────────────────────────────────────────────────────────────────────

export interface Bucket {
    open?: boolean;
    show?: boolean;

    /** Unique identifier — one of PrefabBucketName or a user-generated UUID */
    id: string;
    /** Display name */
    name: string;
    /**
     * Emoji or icon key used in the FAB and widget header.
     * Prefabs use a fixed default; custom buckets let the user pick one.
     */
    icon: string;
    /** Whether this bucket is currently shown as a widget + dial button */
    enabled: boolean;
    /** true for the 6 built-in buckets; false for user-created buckets */
    prefab: boolean;
    items: BucketItem[];
    /** ISO timestamp */
    createdAt: string;
    updatedAt: string;
}

// ── prefab defaults ───────────────────────────────────────────────────────────

export const PREFAB_DEFAULTS: Record<PrefabBucketName, Pick<Bucket, 'name' | 'icon'>> = {
    [PrefabBucketNames.Want]: { name: 'Want', icon: '⭐' },
    [PrefabBucketNames.Need]: { name: 'Need', icon: '📋' },
    [PrefabBucketNames.Have]: { name: 'Have', icon: '🏠' },
    [PrefabBucketNames.Cart]: { name: 'Cart', icon: '🛒' },
    [PrefabBucketNames.Pick]: { name: 'Pick Up', icon: '🏪' },
    [PrefabBucketNames.Auto]: { name: 'Autoship', icon: '🔄' },
};

// ── pet / animal icon palette for custom buckets ────────────────────────────────

export const PET_ICONS: string[] = [
    '🐶', '🐱', '🐰', '🐹', '🐭', '🐮', '🐷',
    '🐸', '🦎', '🐢', '🐍', '🦜', '🐦', '🐟',
    '🐠', '🐡', '🦈', '🐬', '🦦', '🦥', '🦔',
    '🐇', '🐿️', '🦫', '🦭', '🐩', '🦮', '🐈',
    '🐈‍⬛', '🦁', '🐯', '🦊', '🐺',
];
