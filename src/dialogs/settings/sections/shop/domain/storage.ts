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
} from './types';

const STORAGE_KEY = 'petblack:shop-buckets';

const COMMON_BUCKET_NAMES = new Set<string>([
    'cart',
    'want',
    'need',
    'have',
    'pick',
    'auto',
    'drug',
    'diet',
]);

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

function buildPrefab(id: PrefabBucketName, enabled: boolean): Bucket {
    const defaults = PREFAB_DEFAULTS[id];
    return {
        id,
        name: defaults.name,
        icon: defaults.icon,
        enabled,
        show: enabled,
        prefab: true,
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
    if (typeof window === 'undefined') return buildDefaultBuckets();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return buildDefaultBuckets();
        const parsed: Bucket[] = JSON.parse(raw);
        // Convert array to record, back-filling any new prefabs
        const record: Record<string, Bucket> = {};
        for (const bucket of parsed) {
            // Backfill `show` from `enabled` for buckets persisted before `show` was added
            record[bucket.id] = bucket.show !== undefined ? bucket : { ...bucket, show: bucket.enabled };
        }
        for (const id of Object.values(PrefabBucketNames)) {
            if (!(id in record)) {
                record[id] = buildPrefab(id as PrefabBucketName, id === PrefabBucketNames.Cart);
            }
        }
        return record;
    } catch {
        return buildDefaultBuckets();
    }
}

export function saveBuckets(buckets: Record<string, Bucket>): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.values(buckets)));
    notifySubscribers();
}

// ── bucket mutations ────────────────────────────────────────────────────────────

export function setListEnabled(buckets: Record<string, Bucket>, id: string, enabled: boolean): Record<string, Bucket> {
    const bucket = buckets[id];
    if (!bucket || bucket.enabled === enabled) return buckets;
    return { ...buckets, [id]: { ...bucket, enabled, updatedAt: now() } };
}

export function addCustomList(buckets: Record<string, Bucket>, name: string, icon: string): Record<string, Bucket> {
    const id = makeId();
    const next: Bucket = {
        id,
        name,
        icon,
        enabled: true,
        prefab: false,
        items: [],
        createdAt: now(),
        updatedAt: now(),
    };
    return { ...buckets, [id]: next };
}

export function removeCustomList(buckets: Record<string, Bucket>, id: string): Record<string, Bucket> {
    const bucket = buckets[id];
    if (!bucket || bucket.prefab) return buckets;
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

// ── simple pub/sub for cross-component reactivity ─────────────────────────────

type Subscriber = () => void;
const subscribers = new Set<Subscriber>();

export function subscribeToShopLists(fn: Subscriber): () => void {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
}

function notifySubscribers(): void {
    for (const fn of subscribers) fn();
}
