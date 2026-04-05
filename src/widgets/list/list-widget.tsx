'use client';

/**
 * Generic List Widget
 *
 * Renders for: want / need / have / auto / custom lists.
 * FAB → expanded panel showing items with qty controls.
 */

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { WidgetProps } from '@specfocus/shelly/lib/widgets/widget';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { useAtom } from '@specfocus/atoms/lib/hooks';
import { type FC, type ReactNode, useState } from 'react';
import shopListsAtom from '@/dialogs/settings/sections/shop/atoms/shop-lists-atom';
import { addItem, removeItem, updateItemQty } from '@/dialogs/settings/sections/shop/domain/storage';
import listToggleAtom from './atoms/list-toggle-atom';
import { PrefabListIds } from '@/dialogs/settings/sections/shop/domain/types';

interface ListWidgetProps {
    listId?: string;
}

const ListWidget: FC<ListWidgetProps> = ({ listId = PrefabListIds.Want }) => {
    const [lists, setLists] = useAtom(shopListsAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [skuInput, setSkuInput] = useState('');

    const list = lists.find(l => l.id === listId);
    if (!list) return null;

    const handleAddSku = () => {
        const sku = skuInput.trim();
        if (!sku) return;
        setLists(prev => addItem(prev, listId, { sku, name: sku, qty: 1 }));
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
            openAtom={listToggleAtom as WidgetProps['openAtom']}
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
                            <Typography sx={{ fontSize: 22 }}>{list.icon}</Typography>
                            <Typography variant="subtitle2" fontWeight={700}>{list.name}</Typography>
                            <Typography variant="caption" color="text.secondary">({list.items.length})</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsOpen(false)}>
                            <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Items */}
                    <Box sx={{ overflowY: 'auto', flex: 1, px: 1.5, py: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {list.items.length === 0 ? (
                            <Typography variant="body2" color="text.disabled" sx={{ py: 2, textAlign: 'center' }}>
                                No items yet
                            </Typography>
                        ) : (
                            list.items.map(item => (
                                <Box key={item.sku} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                    <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.name}
                                    </Typography>
                                    <QtyButton onClick={() => setLists(prev => updateItemQty(prev, listId, item.sku, item.qty - 1))}>−</QtyButton>
                                    <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>{item.qty}</Typography>
                                    <QtyButton onClick={() => setLists(prev => updateItemQty(prev, listId, item.sku, item.qty + 1))}>+</QtyButton>
                                    <IconButton size="small" onClick={() => setLists(prev => removeItem(prev, listId, item.sku))}>
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
                    aria-label={`Open ${list.name}`}
                    onClick={() => setIsOpen(true)}
                    sx={{ width: 52, height: 52, bgcolor: 'grey.900', color: 'common.white', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'grey.800' } }}
                >
                    <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{list.icon}</Typography>
                </IconButton>
            )}
        </Widget>
    );
};

export default ListWidget;
