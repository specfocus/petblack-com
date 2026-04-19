/**
 * Shop Lists — localStorage persistence layer
 *
 * All shop bucket data is stored under a single key in localStorage as JSON.
 * Changes notify subscribers synchronously (same-tab) via a Set of callbacks.
 */

import {
    PrefabBucketNames,
    PREFAB_DEFAULTS,
    type Bucket,
    type BucketItem,
    type PrefabBucketName,
    PREFAB_BUCKET_NAMES,
    BUCKET,
} from './types';
import { EXPLORE_VIEW_PATH } from '@/views/explore/explore-view-path';

const STORAGE_KEY = 'petblack:shop-buckets';

/**
 * String form of the first-slide view path. Only widgets whose stored
 * `ownerViewPath` matches this value are restored as `open: true` on
 * reload — see `loadBuckets` for the full rationale.
 */
const FIRST_SLIDE_VIEW_PATH = EXPLORE_VIEW_PATH.join('/');

// ── helpers ───────────────────────────────────────────────────────────────────

function now(): string {
    return new Date().toISOString();
}

function makeId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function buildPrefab(name: PrefabBucketName, show: boolean): Bucket {
    const defaults = PREFAB_DEFAULTS[name];
    return {
        '@type': BUCKET,
        name: defaults.name,
        icon: defaults.icon,
        open: defaults.open,
        show: show,
        items: [],
        createdAt: now(),
        updatedAt: now(),
    };
}

// ── initialise default buckets ──────────────────────────────────────────────────

function buildDefaultBuckets(): Record<string, Bucket> {
    return {
        [PrefabBucketNames.Cart]: buildPrefab(PrefabBucketNames.Cart, true),
        [PrefabBucketNames.Want]: buildPrefab(PrefabBucketNames.Want, false),
        [PrefabBucketNames.Need]: buildPrefab(PrefabBucketNames.Need, false),
        [PrefabBucketNames.Have]: buildPrefab(PrefabBucketNames.Have, false),
        [PrefabBucketNames.Pick]: buildPrefab(PrefabBucketNames.Pick, false),
        [PrefabBucketNames.Auto]: buildPrefab(PrefabBucketNames.Auto, false),
        [PrefabBucketNames.Drug]: buildPrefab(PrefabBucketNames.Drug, false),
        [PrefabBucketNames.Diet]: buildPrefab(PrefabBucketNames.Diet, false),
    };
}

// ── read / write ──────────────────────────────────────────────────────────────

export function loadBuckets(): Record<string, Bucket> {
    const defaultBuckets: Record<string, Bucket> = buildDefaultBuckets();
    if (typeof window === 'undefined') return defaultBuckets;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) return defaultBuckets;

        const storedBuckets = JSON.parse(raw) as Record<string, Bucket>;

        if (typeof storedBuckets !== 'object' || storedBuckets === null || Array.isArray(storedBuckets)) return defaultBuckets;

        const buckets = { ...defaultBuckets, ...storedBuckets };

        // Widget `open` state is only restored for widgets that were open
        // on the FIRST slide (the Explorer — always present after reload).
        //
        // Rationale: the widget's open state is tied to the view it was
        // opened in (`ownerViewPath`). After a reload the view stack is
        // rebuilt from URL/navigation and deeper views may not exist,
        // leaving the widget "stranded" — visually open but tied to a
        // non-existent owner view. The first slide's view always exists,
        // so restoring opens that were anchored there is safe.
        //
        // `show` (chain visibility), items, custom buckets, and
        // timestamps ARE always restored.
        for (const key of Object.keys(buckets)) {
            const bucket = buckets[key];
            if (!bucket || !bucket.open) continue;
            if (bucket.ownerViewPath === FIRST_SLIDE_VIEW_PATH) continue;
            buckets[key] = { ...bucket, open: false, ownerViewPath: null };
        }

        return buckets;
    } catch {
        return defaultBuckets;
    }
}

export function saveBuckets(buckets: Record<string, Bucket>): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buckets));
}

// ── bucket visibility ─────────────────────────────────────────────────────────

/** Force a bucket's `show` to `true`. No-ops if already shown or bucket missing. */
export function showBucket(buckets: Record<string, Bucket>, name: string): Record<string, Bucket> {
    const bucket = buckets[name];
    if (!bucket || bucket.show) return buckets;
    return { ...buckets, [name]: { ...bucket, show: true } };
}

export function addCustomList(buckets: Record<string, Bucket>, name: string, icon: string): Record<string, Bucket> {
    const next: Bucket = {
        '@type': BUCKET,
        name,
        icon,
        show: true,
        items: [],
        createdAt: now(),
        updatedAt: now(),
    };
    return { ...buckets, [name]: next };
}

export function removeCustomBucket(buckets: Record<string, Bucket>, id: string): Record<string, Bucket> {
    const bucket = buckets[id];
    if (!bucket || PREFAB_BUCKET_NAMES.includes(bucket.name)) return buckets;
    const { [id]: _removed, ...rest } = buckets;
    return rest;
}

export function renameList(buckets: Record<string, Bucket>, id: string, name: string): Record<string, Bucket> {
    const bucket = buckets[id];
    if (!bucket) return buckets;
    return { ...buckets, [id]: { ...bucket, name, updatedAt: now() } };
}

export function setListIcon(buckets: Record<string, Bucket>, id: string, icon: string): Record<string, Bucket> {
    const bucket = buckets[id];
    if (!bucket) return buckets;
    return { ...buckets, [id]: { ...bucket, icon, updatedAt: now() } };
}

// ── item mutations ────────────────────────────────────────────────────────────

export function addItem(buckets: Record<string, Bucket>, bucketName: string, item: Omit<BucketItem, 'addedAt'>): Record<string, Bucket> {
    const bucket = buckets[bucketName];
    if (!bucket) return buckets;
    const existing = bucket.items.findIndex(i => i.sku === item.sku);
    const items = existing >= 0
        ? bucket.items.map((i, idx) => idx === existing ? { ...i, qty: i.qty + item.qty } : i)
        : [...bucket.items, { ...item, addedAt: now() }];
    return { ...buckets, [bucketName]: { ...bucket, items, updatedAt: now() } };
}

export function removeItem(buckets: Record<string, Bucket>, bucketName: string, sku: string): Record<string, Bucket> {
    const bucket = buckets[bucketName];
    if (!bucket) return buckets;
    return { ...buckets, [bucketName]: { ...bucket, items: bucket.items.filter(i => i.sku !== sku), updatedAt: now() } };
}

export function updateItemQty(buckets: Record<string, Bucket>, bucketName: string, sku: string, qty: number): Record<string, Bucket> {
    if (qty <= 0) return removeItem(buckets, bucketName, sku);
    const bucket = buckets[bucketName];
    if (!bucket) return buckets;
    return { ...buckets, [bucketName]: { ...bucket, items: bucket.items.map(i => i.sku === sku ? { ...i, qty } : i), updatedAt: now() } };
}
