'use client';

/**
 * widgets/bucket/drillin/bucket-drillin
 *
 * Wires the `Drillin` component (inline-expand with View Transitions) to a
 * named bucket's items.
 *
 * - `recordAtoms`        → built per-render via `makeBucketItemAtoms`, stable
 *                          as long as item count doesn't change
 * - `selectedIndexAtom`  → local atom (null = list, number = detail)
 * - `fieldsAtoms`        → image, name, qty  (qty has an inline stepper cellRender)
 * - `detailActions`      → Delete button that removes the item from the bucket
 */

import shopActorAtom from '@/atoms/shop-actor-atom';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import atom from '@specfocus/atoms/lib/atom';
import { useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import Drillin from '@specfocus/shelly/lib/components/drillin/drillin';
import { DrillTriggers } from '@specfocus/shelly/lib/components/drillin/drillin-props';
import type { FieldDef, FieldDefAtom } from '@specfocus/shelly/lib/components/drilldown/drilldown-field';
import type { BucketItem } from '@/domain/types';
import { type FC, useMemo, useRef } from 'react';
import { imageFieldAtom, nameFieldAtom, priceFieldAtom, qtyFieldAtom } from '../drilldown/bucket-item-fields';
import { makeBucketItemAtoms } from '../drilldown/bucket-item-atoms';

type BucketItemKey = keyof BucketItem;

// ── stable selectedIndexAtom ──────────────────────────────────────────────────

function useSelectedIndexAtom() {
    const ref = useRef(atom<number | null>(null));
    return ref.current;
}

// ── qty stepper cell ──────────────────────────────────────────────────────────

/**
 * Inline +/− stepper rendered in the qty cell of each collapsed row.
 * Dispatches UpdateItemQty directly so the change is immediately reflected
 * in the machine state without requiring the row to be expanded.
 */
const QtyStepperCell: FC<{
    qty: number;
    record: BucketItem;
    bucketName: string;
}> = ({ qty, record, bucketName }) => {
    const sendShopEvent = useSetAtom(shopActorAtom);

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (qty <= 1) {
            sendShopEvent({ type: ShopEventTypes.RemoveItem, bucketName, sku: record.sku });
        } else {
            sendShopEvent({ type: ShopEventTypes.UpdateItemQty, bucketName, sku: record.sku, qty: qty - 1 });
        }
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        sendShopEvent({ type: ShopEventTypes.UpdateItemQty, bucketName, sku: record.sku, qty: qty + 1 });
    };

    const isLast = qty <= 1;

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid',
                borderColor: 'primary.main',
                borderRadius: '999px',
                overflow: 'hidden',
                height: 28,
            }}
            onClick={e => e.stopPropagation()}
        >
            <Box
                component="button"
                onClick={handleDecrease}
                sx={{
                    width: 28,
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                    transition: 'background 0.15s',
                    lineHeight: 1,
                }}
            >
                {isLast ? <DeleteRoundedIcon sx={{ fontSize: '0.9rem' }} /> : '−'}
            </Box>
            <Box
                sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'text.primary',
                    px: 0.5,
                    userSelect: 'none',
                }}
            >
                {qty}
            </Box>
            <Box
                component="button"
                onClick={handleIncrease}
                sx={{
                    width: 28,
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                    transition: 'background 0.15s',
                    lineHeight: 1,
                }}
            >
                +
            </Box>
        </Box>
    );
};

// ── field atoms with stepper cellRender ───────────────────────────────────────

/**
 * Build the fields atom array for a specific bucket.
 * The qty field gets a cellRender that renders the +/− stepper,
 * capturing bucketName in the closure.
 */
function useBucketFieldsAtoms(bucketName: string): FieldDefAtom<BucketItem, BucketItemKey>[] {
    return useMemo(() => {
        const qtyWithStepper = atom<FieldDef<BucketItem, 'qty'>>({
            key: 'qty',
            label: 'Qty',
            inputVariant: 'number',
            editable: true,
            align: 'right',
            listFlex: '0 0 100px',
            cellRender: (qty, record) => (
                <QtyStepperCell
                    qty={qty as number}
                    record={record}
                    bucketName={bucketName}
                />
            ),
        });

        return [
            imageFieldAtom,
            nameFieldAtom,
            priceFieldAtom,
            qtyWithStepper,
        ] as FieldDefAtom<BucketItem, BucketItemKey>[];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bucketName]);
}

// ── component ─────────────────────────────────────────────────────────────────

interface BucketDrillinProps {
    bucketName: string;
}

const BucketDrillin: FC<BucketDrillinProps> = ({ bucketName }) => {
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);
    const selectedIndexAtom = useSelectedIndexAtom();
    const fieldsAtoms = useBucketFieldsAtoms(bucketName);

    const bucket = buckets[bucketName];
    const itemCount = bucket?.items.length ?? 0;

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
        <Drillin
            fieldsAtoms={fieldsAtoms}
            recordAtoms={recordAtoms}
            selectedIndexAtom={selectedIndexAtom}
            trigger={DrillTriggers.RowClick}
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

BucketDrillin.displayName = 'BucketDrillin';
export default BucketDrillin;
