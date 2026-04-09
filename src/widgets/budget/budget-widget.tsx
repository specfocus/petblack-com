"use client";

import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { PrefabBucketNames, type BucketItem } from '@/domain/types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from '@specfocus/atoms/lib/hooks';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { type FC, useState } from 'react';
import budgetOpenAtom from './atoms/budget-open-atom';
import budgetShowAtom from './atoms/budget-show-atom';
import monthlyBudgetAtom from './atoms/monthly-budget-atom';

// ── helpers ───────────────────────────────────────────────────────────────────

const bucketTotal = (items: BucketItem[]): number =>
    items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);

const fmt = (value: number): string =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

// ── component ─────────────────────────────────────────────────────────────────

const BudgetWidget: FC = () => {
    const [isOpen, setIsOpen] = useAtom(budgetOpenAtom as never);
    const [budget, setBudget] = useAtom(monthlyBudgetAtom);
    const shopSnapshot = useAtomValue(shopSnapshotAtom);
    const [inputValue, setInputValue] = useState('');
    const [editing, setEditing] = useState(false);

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
        <Widget showAtom={budgetShowAtom} openAtom={budgetOpenAtom} closedIcon={SavingsRoundedIcon}>
            {/* ── Header ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pl: 3,
                    pr: 0.5,
                    py: 0.75,
                    borderBottom: 1,
                    borderColor: 'divider',
                    flexShrink: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                <SavingsRoundedIcon fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                <Typography variant="subtitle2" sx={{ flex: 1 }}>Monthly Budget</Typography>
                <IconButton size="small" onClick={() => setIsOpen(false)} title="Close">
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* ── Body ── */}
            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, overflowY: 'auto' }}>

                {/* Budget input */}
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
                            onKeyDown={e => { if (e.key === 'Enter') commitBudget(); if (e.key === 'Escape') setEditing(false); }}
                            startAdornment={<InputAdornment position="start"><Typography variant="body2" color="text.secondary">$</Typography></InputAdornment>}
                            inputProps={{ inputMode: 'decimal', maxLength: 10 }}
                            sx={{
                                border: 1,
                                borderColor: 'primary.main',
                                px: 1,
                                py: 0.5,
                                fontSize: 14,
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

                {/* Progress bar */}
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
                            {over ? `${fmt(Math.abs(remaining))} over` : budget > 0 ? `${fmt(remaining)} left` : '—'}
                        </Typography>
                    </Box>
                </Box>

                {/* Breakdown */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Row label="🛒 Cart" value={cartTotal} />
                    <Row label="🔄 Autoship" value={autoTotal} />
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 0.75, mt: 0.25 }}>
                        <Row label="Total spending" value={spendingTotal} bold />
                    </Box>
                </Box>
            </Box>
        </Widget>
    );
};

// ── sub-component ─────────────────────────────────────────────────────────────

interface RowProps { label: string; value: number; bold?: boolean; }

const Row: FC<RowProps> = ({ label, value, bold }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" fontWeight={bold ? 600 : 400} color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" fontWeight={bold ? 600 : 400}>
            {fmt(value)}
        </Typography>
    </Box>
);

BudgetWidget.displayName = 'BudgetWidget';

export default BudgetWidget;
