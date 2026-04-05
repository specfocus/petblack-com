/**
 * Shop Lists — localStorage persistence layer
 *
 * All shop list data is stored under a single key in localStorage as JSON.
 * Changes notify subscribers synchronously (same-tab) via a Set of callbacks.
 */

import {
    PrefabListIds,
    PREFAB_DEFAULTS,
    type ShopList,
    type ShopListItem,
    type PrefabListId,
} from './types';

const STORAGE_KEY = 'petblack:shop-lists';

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

function buildPrefab(id: PrefabListId, enabled: boolean): ShopList {
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

// ── initialise default lists ──────────────────────────────────────────────────

function buildDefaultLists(): ShopList[] {
    return [
        buildPrefab(PrefabListIds.Cart, true),   // Cart is always on
        buildPrefab(PrefabListIds.Want, true),
        buildPrefab(PrefabListIds.Need, true),
        buildPrefab(PrefabListIds.Have, false),
        buildPrefab(PrefabListIds.Pick, false),
        buildPrefab(PrefabListIds.Auto, false),
    ];
}

// ── read / write ──────────────────────────────────────────────────────────────

export function loadLists(): ShopList[] {
    if (typeof window === 'undefined') return buildDefaultLists();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return buildDefaultLists();
        const parsed: ShopList[] = JSON.parse(raw);
        // Back-fill any prefab lists that may have been added in a newer version
        const existingIds = new Set(parsed.map(l => l.id));
        const backfilled = [...parsed];
        for (const id of Object.values(PrefabListIds)) {
            if (!existingIds.has(id)) {
                backfilled.push(buildPrefab(id as PrefabListId, id === PrefabListIds.Cart));
            }
        }
        return backfilled;
    } catch {
        return buildDefaultLists();
    }
}

export function saveLists(lists: ShopList[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    notifySubscribers();
}

// ── list mutations ────────────────────────────────────────────────────────────

export function setListEnabled(lists: ShopList[], id: string, enabled: boolean): ShopList[] {
    // Cart is always enabled
    if (id === PrefabListIds.Cart) return lists;
    return lists.map(l => l.id === id ? { ...l, enabled, updatedAt: now() } : l);
}

export function addCustomList(lists: ShopList[], name: string, icon: string): ShopList[] {
    const next: ShopList = {
        id: makeId(),
        name,
        icon,
        enabled: true,
        prefab: false,
        items: [],
        createdAt: now(),
        updatedAt: now(),
    };
    return [...lists, next];
}

export function removeCustomList(lists: ShopList[], id: string): ShopList[] {
    return lists.filter(l => l.id === id ? !l.prefab : true);
}

export function renameList(lists: ShopList[], id: string, name: string): ShopList[] {
    return lists.map(l => l.id === id ? { ...l, name, updatedAt: now() } : l);
}

export function setListIcon(lists: ShopList[], id: string, icon: string): ShopList[] {
    return lists.map(l => l.id === id ? { ...l, icon, updatedAt: now() } : l);
}

// ── item mutations ────────────────────────────────────────────────────────────

export function addItem(lists: ShopList[], listId: string, item: Omit<ShopListItem, 'addedAt'>): ShopList[] {
    return lists.map(l => {
        if (l.id !== listId) return l;
        const existing = l.items.findIndex(i => i.sku === item.sku);
        const items = existing >= 0
            ? l.items.map((i, idx) => idx === existing ? { ...i, qty: i.qty + item.qty } : i)
            : [...l.items, { ...item, addedAt: now() }];
        return { ...l, items, updatedAt: now() };
    });
}

export function removeItem(lists: ShopList[], listId: string, sku: string): ShopList[] {
    return lists.map(l =>
        l.id === listId
            ? { ...l, items: l.items.filter(i => i.sku !== sku), updatedAt: now() }
            : l
    );
}

export function updateItemQty(lists: ShopList[], listId: string, sku: string, qty: number): ShopList[] {
    if (qty <= 0) return removeItem(lists, listId, sku);
    return lists.map(l =>
        l.id === listId
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
