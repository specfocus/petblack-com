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
        prefab: true,
        items: [],
        createdAt: now(),
        updatedAt: now(),
    };
}

// ── initialise default buckets ──────────────────────────────────────────────────

function buildDefaultLists(): Bucket[] {
    return [
        buildPrefab(PrefabBucketNames.Cart, true),
        buildPrefab(PrefabBucketNames.Want, false),
        buildPrefab(PrefabBucketNames.Need, false),
        buildPrefab(PrefabBucketNames.Have, false),
        buildPrefab(PrefabBucketNames.Pick, false),
        buildPrefab(PrefabBucketNames.Auto, false),
    ];
}

// ── read / write ──────────────────────────────────────────────────────────────

export function loadBuckets(): Bucket[] {
    if (typeof window === 'undefined') return buildDefaultLists();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return buildDefaultLists();
        const parsed: Bucket[] = JSON.parse(raw);
        // Back-fill any prefab buckets that may have been added in a newer version
        const existingIds = new Set(parsed.map(l => l.id));
        const backfilled = [...parsed];
        for (const id of Object.values(PrefabBucketNames)) {
            if (!existingIds.has(id)) {
                backfilled.push(buildPrefab(id as PrefabBucketName, id === PrefabBucketNames.Cart));
            }
        }
        return backfilled;
    } catch {
        return buildDefaultLists();
    }
}

export function saveBuckets(buckets: Bucket[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buckets));
    notifySubscribers();
}

// ── bucket mutations ────────────────────────────────────────────────────────────

export function setListEnabled(buckets: Bucket[], id: string, enabled: boolean): Bucket[] {
    return buckets.map(l => {
        if (l.id !== id) return l;
        if (l.enabled === enabled) return l;
        return { ...l, enabled, updatedAt: now() };
    });
}

export function addCustomList(buckets: Bucket[], name: string, icon: string): Bucket[] {
    const next: Bucket = {
        id: makeId(),
        name,
        icon,
        enabled: true,
        prefab: false,
        items: [],
        createdAt: now(),
        updatedAt: now(),
    };
    return [...buckets, next];
}

export function removeCustomList(buckets: Bucket[], id: string): Bucket[] {
    return buckets.filter(l => l.id === id ? !l.prefab : true);
}

export function renameList(buckets: Bucket[], id: string, name: string): Bucket[] {
    return buckets.map(l => l.id === id ? { ...l, name, updatedAt: now() } : l);
}

export function setListIcon(buckets: Bucket[], id: string, icon: string): Bucket[] {
    return buckets.map(l => l.id === id ? { ...l, icon, updatedAt: now() } : l);
}

// ── item mutations ────────────────────────────────────────────────────────────

export function addItem(buckets: Bucket[], bucketName: string, item: Omit<BucketItem, 'addedAt'>): Bucket[] {
    return buckets.map(l => {
        if (l.id !== bucketName) return l;
        const existing = l.items.findIndex(i => i.sku === item.sku);
        const items = existing >= 0
            ? l.items.map((i, idx) => idx === existing ? { ...i, qty: i.qty + item.qty } : i)
            : [...l.items, { ...item, addedAt: now() }];
        return { ...l, items, updatedAt: now() };
    });
}

export function removeItem(buckets: Bucket[], bucketName: string, sku: string): Bucket[] {
    return buckets.map(l =>
        l.id === bucketName
            ? { ...l, items: l.items.filter(i => i.sku !== sku), updatedAt: now() }
            : l
    );
}

export function updateItemQty(buckets: Bucket[], bucketName: string, sku: string, qty: number): Bucket[] {
    if (qty <= 0) return removeItem(buckets, bucketName, sku);
    return buckets.map(l =>
        l.id === bucketName
            ? { ...l, items: l.items.map(i => i.sku === sku ? { ...i, qty } : i), updatedAt: now() }
            : l
    );
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
