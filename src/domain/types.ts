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
    Auto = 'auto',
    Cart = 'cart',
    Diet = 'diet',
    Drug = 'drug',
    Have = 'have',
    Need = 'need',
    Pick = 'pick',
    Want = 'want'
}

export type PrefabBucketName = `${PrefabBucketNames}`;

export const PREFAB_BUCKET_NAMES: string[] = [
    PrefabBucketNames.Auto,
    PrefabBucketNames.Cart,
    PrefabBucketNames.Diet,
    PrefabBucketNames.Drug,
    PrefabBucketNames.Have,
    PrefabBucketNames.Need,
    PrefabBucketNames.Pick,
    PrefabBucketNames.Want
];

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
    /** Product thumbnail URL (denormalised from the catalogue at add-time) */
    imageUrl?: string;
    /** Unit price in the offer currency (denormalised from the catalogue at add-time) */
    price?: number;
}

// ── bucket ──────────────────────────────────────────────────────────────────────

export const BUCKET = 'bucket';

export interface Bucket {
    '@type': typeof BUCKET;
    open?: boolean;
    show?: boolean;
    /** Display name */
    name: string;
    /**
     * Emoji or icon key used in the FAB and widget header.
     * Prefabs use a fixed default; custom buckets let the user pick one.
     */
    icon: string;
    items: BucketItem[];
    /** ISO timestamp */
    createdAt: string;
    updatedAt: string;
}

// ── prefab defaults ───────────────────────────────────────────────────────────

export const PREFAB_DEFAULTS: Record<PrefabBucketName, Pick<Bucket, '@type' | 'name' | 'icon' | 'open' | 'show'>> = {
    [PrefabBucketNames.Auto]: { '@type': BUCKET, name: 'auto', icon: '🔄', open: false, show: false },
    [PrefabBucketNames.Cart]: { '@type': BUCKET, name: 'cart', icon: '🛒', open: false, show: true },
    [PrefabBucketNames.Diet]: { '@type': BUCKET, name: 'diet', icon: '🥦', open: false, show: false },
    [PrefabBucketNames.Drug]: { '@type': BUCKET, name: 'drug', icon: '💊', open: false, show: false },
    [PrefabBucketNames.Want]: { '@type': BUCKET, name: 'want', icon: '⭐', open: false, show: false },
    [PrefabBucketNames.Need]: { '@type': BUCKET, name: 'need', icon: '📋', open: false, show: false },
    [PrefabBucketNames.Have]: { '@type': BUCKET, name: 'have', icon: '🏠', open: false, show: false },
    [PrefabBucketNames.Pick]: { '@type': BUCKET, name: 'pick', icon: '🏪', open: false, show: false },
};

// ── pet / animal icon palette for custom buckets ────────────────────────────────

export enum PenIcons {
    Dog = '🐶',
    Cat = '🐱',
    Rabbit = '🐰',
    Hamster = '🐹',
    Mouse = '🐭',
    Cow = '🐮',
    Pig = '🐷',
    Frog = '🐸',
    Lizard = '🦎',
    Turtle = '🐢',
    Snake = '🐍',
    Parrot = '🦜',
    Bird = '🐦',
    Fish = '🐟',
    TropicalFish = '🐠',
    Blowfish = '🐡',
    Shark = '🦈',
    Dolphin = '🐬',
    Otter = '🦦',
    Sloth = '🦥',
    Hedgehog = '🦔',
    Rabbit2 = '🐇',
    Chipmunk = '🐿️',
    Beaver = '🦫',
    Seal = '🦭',
    Poodle = '🐩',
    GuideDog = '🦮',
    YellowCat = '🐈',
    BlackCat = '🐈‍⬛',
    Lion = '🦁',
    Tiger = '🐯',
    Fox = '🦊',
    Wolf = '🐺'
}

export const PET_ICONS: string[] = [
    PenIcons.Dog,
    PenIcons.Cat,
    PenIcons.Rabbit,
    PenIcons.Hamster,
    PenIcons.Mouse,
    PenIcons.Cow,
    PenIcons.Pig,
    PenIcons.Frog,
    PenIcons.Lizard,
    PenIcons.Turtle,
    PenIcons.Snake,
    PenIcons.Parrot,
    PenIcons.Bird,
    PenIcons.Fish,
    PenIcons.TropicalFish,
    PenIcons.Blowfish,
    PenIcons.Shark,
    PenIcons.Dolphin,
    PenIcons.Otter,
    PenIcons.Sloth,
    PenIcons.Hedgehog,
    PenIcons.Rabbit2,
    PenIcons.Chipmunk,
    PenIcons.Beaver,
    PenIcons.Seal,
    PenIcons.Poodle,
    PenIcons.GuideDog,
    PenIcons.YellowCat,
    PenIcons.BlackCat,
    PenIcons.Lion,
    PenIcons.Tiger,
    PenIcons.Fox,
    PenIcons.Wolf
];
