'use client';

/**
 * Shop List Widget
 *
 * Single-bucket widget instance.
 * Each bucket is installed independently in the workspace tree.
 */

import shopActorAtom from '@/atoms/shop-actor-atom';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import { isToggleEntry, noopToggleAtom } from '@specfocus/atoms/lib/toggle';
import workspaceTreeAtom from '@specfocus/atoms/lib/workspace';
import type { WidgetProps } from '@specfocus/shelly/lib/widgets/widget';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { type FC, type ReactNode, useMemo, useState } from 'react';
import { WIDGETS_PATH } from '../widgets-path';

interface BucketWidgetProps {
    bucketName?: string;
}

const fallbackListOpenAtom = noopToggleAtom;
const fallbackListShowAtom = noopToggleAtom;

const BucketWidget: FC<BucketWidgetProps> = ({ bucketName = 'want' }) => {
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);
    const openTogglePath = useMemo(() => [...WIDGETS_PATH, bucketName, 'toggles', 'open'], [bucketName]);
    const showTogglePath = useMemo(() => [...WIDGETS_PATH, bucketName, 'toggles', 'show'], [bucketName]);
    const bucketOpenToggleEntry = useAtomValue(workspaceTreeAtom(openTogglePath));
    const bucketShowToggleEntry = useAtomValue(workspaceTreeAtom(showTogglePath));
    const bucketOpenAtom = isToggleEntry(bucketOpenToggleEntry) ? bucketOpenToggleEntry.atom : fallbackListOpenAtom;
    const bucketShowAtom = isToggleEntry(bucketShowToggleEntry) ? bucketShowToggleEntry.atom : fallbackListShowAtom;
    const [isOpen, setIsOpen] = useAtom(bucketOpenAtom as never);
    const [skuInput, setSkuInput] = useState('');
    const bucket = buckets[bucketName];

    if (!bucket) return null;

    const totalQty = bucket.items.reduce((sum, item) => sum + item.qty, 0);

    const handleAddSku = () => {
        const sku = skuInput.trim();
        if (!sku) return;
        sendShopEvent({
            type: ShopEventTypes.AddItem,
            bucketName: bucket.id,
            sku,
            name: sku,
            qty: 1,
        });
        setSkuInput('');
    };

    const QtyButton = ({ onClick, children }: { onClick: () => void; children: ReactNode; }) => (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                width: 24, height: 24, border: 1, borderColor: 'divider',
                borderRadius: 1, bgcolor: 'background.paper', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'text.primary', fontSize: 14, lineHeight: 1,
                '&:hover': { bgcolor: 'action.hover' },
            }}
        >
            {children}
        </Box>
    );

    return (
        <Widget
            openAtom={bucketShowAtom as WidgetProps['openAtom']}
            defaultCorner="bottom-right"
            sx={isOpen ? undefined : { overflow: 'visible', background: 'transparent', boxShadow: 'none' }}
        >
            {isOpen ? (
                <Paper
                    elevation={12}
                    sx={{
                        width: { xs: 'calc(100vw - 24px)', sm: 320 },
                        maxHeight: 480,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
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
                    <Box sx={{ overflowY: 'auto', flex: 1, px: 1.5, py: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {bucket.items.length === 0 ? (
                            <Typography variant="body2" color="text.disabled" sx={{ py: 2, textAlign: 'center' }}>
                                No items yet
                            </Typography>
                        ) : (
                            bucket.items.map(item => (
                                <Box key={item.sku} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                    <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.name}
                                    </Typography>
                                    <QtyButton
                                        onClick={() => sendShopEvent({
                                            type: ShopEventTypes.UpdateItemQty,
                                            bucketName: bucket.id,
                                            sku: item.sku,
                                            qty: item.qty - 1,
                                        })}
                                    >
                                        −
                                    </QtyButton>
                                    <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>{item.qty}</Typography>
                                    <QtyButton
                                        onClick={() => sendShopEvent({
                                            type: ShopEventTypes.UpdateItemQty,
                                            bucketName: bucket.id,
                                            sku: item.sku,
                                            qty: item.qty + 1,
                                        })}
                                    >
                                        +
                                    </QtyButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => sendShopEvent({
                                            type: ShopEventTypes.RemoveItem,
                                            bucketName: bucket.id,
                                            sku: item.sku,
                                        })}
                                    >
                                        <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Add by SKU */}
                    <Box sx={{ borderTop: 1, borderColor: 'divider', p: 1.25, display: 'flex', gap: 1 }}>
                        <InputBase
                            value={skuInput}
                            onChange={e => setSkuInput(e.target.value)}
                            placeholder="Add SKU…"
                            onKeyDown={e => e.key === 'Enter' && handleAddSku()}
                            sx={{ flex: 1, border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.25, py: 0.75, fontSize: 13 }}
                        />
                        <IconButton size="small" onClick={handleAddSku} disabled={!skuInput.trim()}>
                            <AddRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            ) : (
                <IconButton
                    aria-label={`Open ${bucket.name} bucket`}
                    onClick={() => setIsOpen(true)}
                    sx={{
                        width: 52,
                        height: 52,
                        bgcolor: 'grey.900',
                        color: 'common.white',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        '&:hover': { bgcolor: 'grey.800' },
                        position: 'relative',
                    }}
                >
                    <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{bucket.icon}</Typography>
                    {totalQty > 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                minWidth: 20,
                                height: 20,
                                borderRadius: '999px',
                                px: 0.5,
                                bgcolor: 'error.main',
                                color: 'error.contrastText',
                                fontSize: 11,
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 700,
                            }}
                        >
                            {totalQty}
                        </Box>
                    )}
                </IconButton>
            )}
        </Widget>
    );
};

export default BucketWidget;
