'use client';

/**
 * widgets/bucket/drilldown/bucket-drilldown
 *
 * Wires the generic `Drilldown` component to a named bucket's items.
 *
 * - `recordAtoms`        → built per-render via `makeBucketItemAtoms`, stable
 *                          as long as item count doesn't change
 * - `selectedIndexAtom`  → local atom (null = list, number = detail)
 * - `fieldsAtoms`        → all four BucketItem field atoms
 * - `detailActions`      → Delete button that removes the item from the bucket
 */

import shopActorAtom from '@/atoms/shop-actor-atom';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import atom from '@specfocus/atoms/lib/atom';
import { useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import Drilldown from '@specfocus/shelly/lib/components/drilldown/drilldown';
import type { BucketItem } from '@/domain/types';
import type { FieldDefAtom } from '@specfocus/shelly/lib/components/drilldown/drilldown-field';
import { type FC, useMemo, useRef } from 'react';
import { bucketItemAllFieldsAtoms } from './bucket-item-fields';
import { makeBucketItemAtoms } from './bucket-item-atoms';

type BucketItemKey = keyof BucketItem;

// Widen the tuple to a homogeneous array so Drilldown<BucketItem, BucketItemKey>
// accepts it without unsafe casts on the component side.
const fieldsAtoms = bucketItemAllFieldsAtoms as FieldDefAtom<BucketItem, BucketItemKey>[];

// ── stable selectedIndexAtom ──────────────────────────────────────────────────

/**
 * Each BucketDrilldown instance gets its own stable atom.
 * We create it once per instance by holding it in a ref so it survives
 * re-renders without being recreated.
 */
function useSelectedIndexAtom() {
    const ref = useRef(atom<number | null>(null));
    return ref.current;
}

// ── component ─────────────────────────────────────────────────────────────────

interface BucketDrilldownProps {
    bucketName: string;
}

const BucketDrilldown: FC<BucketDrilldownProps> = ({ bucketName }) => {
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);
    const selectedIndexAtom = useSelectedIndexAtom();

    const bucket = buckets[bucketName];
    const itemCount = bucket?.items.length ?? 0;

    // Rebuild only when the item count changes. Individal field changes are
    // handled by the writable atoms themselves reading live snapshot values.
    const recordAtoms = useMemo(
        () => makeBucketItemAtoms(bucketName, itemCount),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [bucketName, itemCount],
    );

    if (!bucket || itemCount === 0) {
        return (
            <Typography variant="body2" color="text.disabled" sx={{ py: 2, textAlign: 'center' }}>
                No items yet
            </Typography>
        );
    }

    return (
        <Drilldown
            fieldsAtoms={fieldsAtoms}
            recordAtoms={recordAtoms}
            selectedIndexAtom={selectedIndexAtom}
            skeletonRowCount={3}
            detailActions={(record, onBack) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteRoundedIcon />}
                    onClick={() => {
                        sendShopEvent({
                            type: ShopEventTypes.RemoveItem,
                            bucketName,
                            sku: record.sku,
                        });
                        onBack();
                    }}
                >
                    Remove
                </Button>
            )}
        />
    );
};

export default BucketDrilldown;
