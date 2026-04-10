'use client';

/**
 * ledgerAtom
 *
 * Persisted array of LedgerEntry records (purchase history).
 * Stored in localStorage under LEDGER_KEY.
 *
 * On first load (empty localStorage) a seed-effect atom automatically
 * fetches demo data from GET /api/ledger so the Ledger view has
 * something to show immediately.
 */

import atom from '@specfocus/atoms/lib/atom';
import atomEffect from '@specfocus/atoms/lib/effect';
import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import type { BucketItem } from '@/domain/types';
import { LEDGER_KEY, LedgerSources, type LedgerEntry } from '@/domain/ledger-types';

// ── persistence helpers ────────────────────────────────────────────────────────

const loadLedger = (): LedgerEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(LEDGER_KEY);
        return raw ? (JSON.parse(raw) as LedgerEntry[]) : [];
    } catch {
        return [];
    }
};

const saveLedger = (entries: LedgerEntry[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(LEDGER_KEY, JSON.stringify(entries));
    } catch {
        // storage full — ignore
    }
};

// ── atom ──────────────────────────────────────────────────────────────────────

const _ledgerStateAtom = atom<LedgerEntry[]>(loadLedger());

type LedgerUpdater = (prev: LedgerEntry[]) => LedgerEntry[];

const ledgerAtom = atom<LedgerEntry[], [LedgerEntry[] | LedgerUpdater], void>(
    (get) => get(_ledgerStateAtom),
    (_get, set, update) => {
        set(_ledgerStateAtom, (prev) => {
            const next = typeof update === 'function' ? update(prev) : update;
            saveLedger(next);
            return next;
        });
    }
);

ledgerAtom.debugLabel = 'ledgerAtom';

export default ledgerAtom;

// ── seed-from-API effect ──────────────────────────────────────────────────────

/**
 * ledgerSeedEffectAtom
 *
 * Mount once (e.g. inside LedgerView) to auto-fetch demo data from
 * GET /api/ledger when localStorage is empty.
 * Does nothing if the user already has stored entries.
 */
export const ledgerSeedEffectAtom: ReadonlyAtom<void> = atomEffect(
    (_get, set) => {
        if (typeof window === 'undefined') return;
        const existing = loadLedger();
        if (existing.length > 0) return; // already have data — skip

        let cancelled = false;

        fetch('/api/ledger?count=60&months=6')
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then((body: { entries: LedgerEntry[]; }) => {
                if (cancelled) return;
                set(ledgerAtom, body.entries);
            })
            .catch(() => {
                // API unavailable — leave ledger empty; user can still add entries manually
            });

        return () => { cancelled = true; };
    }
);

ledgerSeedEffectAtom.debugLabel = 'ledgerSeedEffectAtom';

// ── seed helper ──────────────────────────────────────────────────────────────

/** Infer a rough product category from the item name / sku. */
const inferCategory = (item: BucketItem): string => {
    const text = `${item.name} ${item.sku}`.toLowerCase();
    if (/food|kibble|wet|dry|treat|chew|snack|meal/.test(text)) return 'Food & Treats';
    if (/toy|ball|rope|tug|puzzle/.test(text)) return 'Toys';
    if (/med|vitamin|supplement|probiotic|omega|joint|dental/.test(text)) return 'Health & Wellness';
    if (/shampoo|brush|comb|collar|harness|lead|leash|groom/.test(text)) return 'Grooming & Accessories';
    if (/litter|sand|box|pad|tray/.test(text)) return 'Litter & Hygiene';
    if (/bed|crate|cage|crib|mat|blanket/.test(text)) return 'Beds & Housing';
    return 'Other';
};

/**
 * Build a seeded history from supplied bucket items spread over the past
 * `months` months. Call this when ledger is empty to have demo data ready.
 */
export const buildSeedEntries = (
    cartItems: BucketItem[],
    autoItems: BucketItem[],
    months = 3
): LedgerEntry[] => {
    const entries: LedgerEntry[] = [];
    const now = new Date();

    const addItems = (items: BucketItem[], source: `${LedgerSources}`) => {
        for (let m = 0;m < months;m++) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - m);
            // Scatter within the month
            date.setDate(Math.ceil(Math.random() * 28));

            for (const item of items) {
                if (!item.price) continue;
                entries.push({
                    id: `${source}-${item.sku}-${m}-${Date.now()}${Math.random()}`,
                    date: date.toISOString(),
                    sku: item.sku,
                    name: item.name,
                    category: inferCategory(item),
                    petName: 'General',
                    qty: item.qty,
                    unitPrice: item.price,
                    source,
                });
            }
        }
    };

    addItems(cartItems, LedgerSources.Cart);
    addItems(autoItems, LedgerSources.Auto);

    return entries.sort((a, b) => b.date.localeCompare(a.date));
};
