"use client";

/**
 * BudgetLedger
 *
 * Shared content for BudgetWidget (compact) and BudgetView (full-width).
 *
 * `variant="widget"` — tight padding, used inside the widget slot.
 * `variant="view"`   — relaxed padding, used in the main slide view.
 *
 * Shows:
 *  - Monthly budget input (click-to-edit, persisted to localStorage)
 *  - Progress bar with % used / remaining / over-budget callout
 *  - Per-item ledger table for Cart and Autoship buckets
 */

import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { PrefabBucketNames, type BucketItem } from '@/domain/types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from '@specfocus/atoms/lib/hooks';
import { useState, type FC } from 'react';
import monthlyBudgetAtom from './atoms/monthly-budget-atom';

// ── helpers ───────────────────────────────────────────────────────────────────

export const bucketTotal = (items: BucketItem[]): number =>
    items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);

export const fmt = (value: number): string =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

// ── types ─────────────────────────────────────────────────────────────────────

export type BudgetLedgerVariant = 'widget' | 'view';

export interface BudgetLedgerProps {
    variant: BudgetLedgerVariant;
}

// ── sub-components ────────────────────────────────────────────────────────────

interface SummaryRowProps { label: string; value: number; bold?: boolean; }

const SummaryRow: FC<SummaryRowProps> = ({ label, value, bold }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" fontWeight={bold ? 600 : 400} color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight={bold ? 600 : 400}>{fmt(value)}</Typography>
    </Box>
);

interface LedgerSectionProps { icon: string; label: string; items: BucketItem[]; }

const LedgerSection: FC<LedgerSectionProps> = ({ icon, label, items }) => {
    const total = bucketTotal(items);
    return (
        <Box>
            {/* Section header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {icon} {label}
                </Typography>
                <Typography variant="caption" fontWeight={600}>{fmt(total)}</Typography>
            </Box>

            {items.length === 0 ? (
                <Typography variant="caption" color="text.disabled" sx={{ pl: 0.5 }}>
                    No items
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {items.map(item => (
                        <Box
                            key={item.sku}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto auto',
                                alignItems: 'center',
                                gap: 1,
                                pl: 0.5,
                            }}
                        >
                            <Typography variant="body2" noWrap title={item.name}>
                                {item.name}
                            </Typography>
                            <Chip
                                label={`×${item.qty}`}
                                size="small"
                                sx={{ fontSize: 11, height: 18, px: 0.25 }}
                            />
                            <Typography variant="body2" sx={{ textAlign: 'right', minWidth: 56 }}>
                                {fmt((item.price ?? 0) * item.qty)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

// ── main component ────────────────────────────────────────────────────────────

const BudgetLedger: FC<BudgetLedgerProps> = ({ variant }) => {
    const [budget, setBudget] = useAtom(monthlyBudgetAtom);
    const shopSnapshot = useAtomValue(shopSnapshotAtom);
    const [inputValue, setInputValue] = useState('');
    const [editing, setEditing] = useState(false);

    const isView = variant === 'view';
    const p = isView ? 2 : 1.5;

    const cartItems = shopSnapshot.context.buckets[PrefabBucketNames.Cart]?.items ?? [];
    const autoItems = shopSnapshot.context.buckets[PrefabBucketNames.Auto]?.items ?? [];

    const cartTotal = bucketTotal(cartItems);
    const autoTotal = bucketTotal(autoItems);
    const spendingTotal = cartTotal + autoTotal;

    const pct = budget > 0 ? Math.min((spendingTotal / budget) * 100, 100) : 0;
    const over = budget > 0 && spendingTotal > budget;
    const remaining = budget - spendingTotal;
    const barColor = over ? 'error' : pct >= 80 ? 'warning' : 'success';

    const commitBudget = () => {
        const parsed = parseFloat(inputValue.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) setBudget(parsed);
        setEditing(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
            <Box sx={{ p, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* ── Budget input ── */}
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Budget / month
                    </Typography>
                    {editing ? (
                        <InputBase
                            autoFocus
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onBlur={commitBudget}
                            onKeyDown={e => {
                                if (e.key === 'Enter') commitBudget();
                                if (e.key === 'Escape') setEditing(false);
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Typography variant="body2" color="text.secondary">$</Typography>
                                </InputAdornment>
                            }
                            inputProps={{ inputMode: 'decimal', maxLength: 10 }}
                            sx={{
                                border: 1,
                                borderColor: 'primary.main',
                                px: 1,
                                py: 0.5,
                                fontSize: isView ? 15 : 14,
                                width: '100%',
                                bgcolor: 'background.default',
                            }}
                        />
                    ) : (
                        <Box
                            onClick={() => { setInputValue(budget > 0 ? String(budget) : ''); setEditing(true); }}
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                px: 1,
                                py: 0.75,
                                cursor: 'text',
                                bgcolor: 'background.default',
                                '&:hover': { borderColor: 'text.secondary' },
                            }}
                        >
                            <Typography variant="body2" color={budget > 0 ? 'text.primary' : 'text.disabled'}>
                                {budget > 0 ? fmt(budget) : 'Set a budget…'}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ── Progress bar ── */}
                <Box>
                    <LinearProgress
                        variant="determinate"
                        value={pct}
                        color={barColor}
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {Math.round(pct)}% used
                        </Typography>
                        <Typography variant="caption" color={over ? 'error.main' : 'text.secondary'}>
                            {over
                                ? `${fmt(Math.abs(remaining))} over`
                                : budget > 0
                                    ? `${fmt(remaining)} left`
                                    : '—'}
                        </Typography>
                    </Box>
                </Box>

                {/* ── Summary totals ── */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <SummaryRow label="🛒 Cart" value={cartTotal} />
                    <SummaryRow label="🔄 Autoship" value={autoTotal} />
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 0.75, mt: 0.25 }}>
                        <SummaryRow label="Total spending" value={spendingTotal} bold />
                    </Box>
                </Box>

                {/* ── Per-item ledger (view only shows full detail; widget shows it too but compact) ── */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: isView ? 2.5 : 1.5 }}>
                    <LedgerSection icon="🛒" label="Cart items" items={cartItems} />
                    <LedgerSection icon="🔄" label="Autoship items" items={autoItems} />
                </Box>
            </Box>
        </Box>
    );
};

BudgetLedger.displayName = 'BudgetLedger';

export default BudgetLedger;
