/**
 * widgets/bucket/drilldown/bucket-item-atoms
 *
 * Factory that derives an array of writable `Atom<BucketItem>` from a single
 * bucket name.
 *
 * Each atom:
 *  - READ  → live value from `shopSnapshotBucketsAtom` (always fresh)
 *  - WRITE → dispatches `UpdateItemQty` / `AddItem` to the shop machine when
 *            qty or sku changes; updating `name` derived from the SKU is
 *            handled by a helper exported alongside the atom factory.
 *
 * These atoms are intentionally **not** stored in `workspaceTreeAtom` because
 * they are transient view-state (the list rebuilds when the bucket changes).
 * The BucketDrilldown component calls `makeBucketItemAtoms` inside a `useMemo`
 * keyed on the item count and SKUs so the array is stable between renders.
 */

import atom from '@specfocus/atoms/lib/atom';
import type { Atom } from '@specfocus/atoms/lib/atom';
import type { Getter, Setter } from '@specfocus/atoms/lib/atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import type { BucketItem } from '@/domain/types';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import { PRODUCTS } from '@/data/products';

// ── helpers ───────────────────────────────────────────────────────────────────

/** Resolve the display name for a SKU from the in-memory product catalogue. */
export function resolveProductName(sku: string): string {
    const product = PRODUCTS.find((p) => p.sku === sku || p['@id'] === sku);
    return product?.name ?? sku;
}

// ── factory ───────────────────────────────────────────────────────────────────

/**
 * Creates one writable `Atom<BucketItem>` per item in the named bucket.
 *
 * The read side always returns the **current snapshot** value at `index`, so
 * changes dispatched to the machine are reflected immediately when the
 * machine emits a new snapshot.
 *
 * The write side:
 * - Changing `qty`  → `ShopEventTypes.UpdateItemQty`
 * - Changing `sku`  → `ShopEventTypes.RemoveItem` + `ShopEventTypes.AddItem`
 *                     (auto-resolves `name` from the product catalogue)
 * - qty ≤ 0         → `ShopEventTypes.RemoveItem`
 */
export function makeBucketItemAtoms(
    bucketName: string,
    itemCount: number,
): Atom<BucketItem>[] {
    return Array.from({ length: itemCount }, (_, index) =>
        atom(
            // READ: live snapshot
            (get: Getter): BucketItem => {
                const buckets = get(shopSnapshotBucketsAtom);
                const bucket = buckets[bucketName];
                const item = bucket?.items[index];
                if (!item) {
                    // Defensive fallback — index may briefly be out of range
                    // during a remove transition.
                    return { sku: '', name: '', qty: 0, addedAt: new Date().toISOString() };
                }
                return item;
            },
            // WRITE: dispatch to shop machine
            (get: Getter, set: Setter, next: BucketItem | ((prev: BucketItem) => BucketItem)) => {
                const buckets = get(shopSnapshotBucketsAtom);
                const bucket = buckets[bucketName];
                const prev = bucket?.items[index];
                if (!prev) return;

                const updated = typeof next === 'function' ? next(prev) : next;

                if (updated.sku !== prev.sku) {
                    // SKU changed: remove old, add new
                    set(shopActorAtom, {
                        type: ShopEventTypes.RemoveItem,
                        bucketName,
                        sku: prev.sku,
                    });
                    set(shopActorAtom, {
                        type: ShopEventTypes.AddItem,
                        bucketName,
                        sku: updated.sku,
                        name: resolveProductName(updated.sku),
                        qty: updated.qty > 0 ? updated.qty : 1,
                    });
                } else if (updated.qty !== prev.qty) {
                    if (updated.qty <= 0) {
                        set(shopActorAtom, {
                            type: ShopEventTypes.RemoveItem,
                            bucketName,
                            sku: prev.sku,
                        });
                    } else {
                        set(shopActorAtom, {
                            type: ShopEventTypes.UpdateItemQty,
                            bucketName,
                            sku: prev.sku,
                            qty: updated.qty,
                        });
                    }
                }
                // name and addedAt are derived/immutable — no write needed
            },
        )
    );
}
