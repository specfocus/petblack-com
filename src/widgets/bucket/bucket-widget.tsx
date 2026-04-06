'use client';

/**
 * Shop List Widget — inner content only.
 * Widget (shelly) owns the container, background, drag handle and open/closed
 * state. This component renders only the content for each state.
 */

import shopActorAtom from '@/atoms/shop-actor-atom';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import { isToggleEntry, noopToggleAtom } from '@specfocus/atoms/lib/toggle';
import workspaceTreeAtom from '@specfocus/atoms/lib/workspace';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { type FC, useMemo, useState } from 'react';
import BucketDrillin from './drillin/bucket-drillin';
import { WIDGETS_PATH } from '../widgets-path';

interface BucketWidgetProps {
    bucketName?: string;
}

const fallbackOpenAtom = noopToggleAtom;
const fallbackShowAtom = noopToggleAtom;

const BucketWidget: FC<BucketWidgetProps> = ({ bucketName = 'want' }) => {
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);
    const openTogglePath = useMemo(() => [...WIDGETS_PATH, bucketName, 'toggles', 'open'], [bucketName]);
    const showTogglePath = useMemo(() => [...WIDGETS_PATH, bucketName, 'toggles', 'show'], [bucketName]);
    const openEntry = useAtomValue(workspaceTreeAtom(openTogglePath));
    const showEntry = useAtomValue(workspaceTreeAtom(showTogglePath));
    const bucketOpenAtom = isToggleEntry(openEntry) ? openEntry.atom : fallbackOpenAtom;
    const bucketShowAtom = isToggleEntry(showEntry) ? showEntry.atom : fallbackShowAtom;
    const [, setIsOpen] = useAtom(bucketOpenAtom as never);
    const [skuInput, setSkuInput] = useState('');
    const bucket = buckets[bucketName];

    if (!bucket) return null;

    const totalQty = bucket.items.reduce((sum, item) => sum + item.qty, 0);

    const handleAddSku = () => {
        const sku = skuInput.trim();
        if (!sku) return;
        sendShopEvent({ type: ShopEventTypes.AddItem, bucketName: bucket.name, sku, name: sku, qty: 1 });
        setSkuInput('');
    };

    return (
        <Widget showAtom={bucketShowAtom} openAtom={bucketOpenAtom} closedLabel={bucket.icon} closedBadge={totalQty}>
            {/* ── open: header + items + SKU input ── */}
            <>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 22 }}>{bucket.icon}</Typography>
                        <Typography variant="subtitle2" fontWeight={700}>{bucket.name}</Typography>
                        <Typography variant="caption" color="text.secondary">({bucket.items.length})</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setIsOpen(false)}>
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                </Box>
                {/* Items */}
                <Box sx={{ overflowY: 'auto', flex: 1, px: 1, py: 0.5 }}>
                    <BucketDrillin bucketName={bucketName} />
                </Box>
                {/* Add by SKU */}
                <Box sx={{ borderTop: 1, borderColor: 'divider', p: 1.25, display: 'flex', gap: 1, flexShrink: 0 }}>
                    <InputBase value={skuInput} onChange={e => setSkuInput(e.target.value)} placeholder="Add SKU…" onKeyDown={e => e.key === 'Enter' && handleAddSku()} sx={{ flex: 1, border: 1, borderColor: 'divider', px: 1.25, py: 0.75, fontSize: 13 }} />
                    <IconButton size="small" onClick={handleAddSku} disabled={!skuInput.trim()}>
                        <AddRoundedIcon fontSize="small" />
                    </IconButton>
                </Box>
            </>
        </Widget>
    );
};

export default BucketWidget;
