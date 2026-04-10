"use client";

/**
 * LedgerCharts
 *
 * Three chart panels inside a responsive grid:
 *
 *   ┌─────────────────────────┬─────────────────────────┐
 *   │  Spending by Category   │  Spending by Pet        │
 *   │  (PieChart)             │  (PieChart)             │
 *   └─────────────────────────┴─────────────────────────┘
 *   ┌─────────────────────────────────────────────────── ┐
 *   │  Spending over time (BarChart — stacked by source) │
 *   │  Footer: time-frame selector (7d / 30d / 90d / all)│
 *   └─────────────────────────────────────────────────── ┘
 */

import ledgerAtom from '@/atoms/ledger-atom';
import { ledgerEntryTotal, type LedgerEntry } from '@/domain/ledger-types';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAtomValue } from '@specfocus/atoms/lib/hooks';
import { useMemo, useState, type FC } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// ── palette ───────────────────────────────────────────────────────────────────

const PIE_COLORS = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6',
    '#f97316', '#84cc16',
];

// ── time-frame helpers ────────────────────────────────────────────────────────

export enum TimeFrames {
    Days7 = '7d',
    Days30 = '30d',
    Days90 = '90d',
    All = 'all',
}

export type TimeFrame = `${TimeFrames}`;

const TIME_FRAME_LABELS: Record<TimeFrame, string> = {
    [TimeFrames.Days7]: '7 d',
    [TimeFrames.Days30]: '30 d',
    [TimeFrames.Days90]: '90 d',
    [TimeFrames.All]: 'All',
};

const cutoff = (frame: TimeFrame): Date | null => {
    if (frame === TimeFrames.All) return null;
    const d = new Date();
    d.setDate(d.getDate() - Number(frame.replace('d', '')));
    return d;
};

// ── chart helpers ─────────────────────────────────────────────────────────────

const fmt = (v: number) =>
    v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

/** Group entries by a key and sum totals */
const groupBy = (entries: LedgerEntry[], key: keyof LedgerEntry): { name: string; value: number; }[] => {
    const map = new Map<string, number>();
    for (const e of entries) {
        const k = String(e[key]);
        map.set(k, (map.get(k) ?? 0) + ledgerEntryTotal(e));
    }
    return Array.from(map.entries())
        .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
        .sort((a, b) => b.value - a.value);
};

/** Build monthly buckets for the timeline bar chart */
const buildTimeline = (entries: LedgerEntry[]): { month: string; cart: number; auto: number; }[] => {
    const map = new Map<string, { cart: number; auto: number; }>();
    for (const e of entries) {
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const cur = map.get(key) ?? { cart: 0, auto: 0 };
        const total = ledgerEntryTotal(e);
        if (e.source === 'cart') cur.cart += total;
        else cur.auto += total;
        map.set(key, cur);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, v]) => ({
            month,
            cart: Math.round(v.cart * 100) / 100,
            auto: Math.round(v.auto * 100) / 100,
        }));
};

// ── custom tooltip ────────────────────────────────────────────────────────────

const PieTooltip: FC<{ active?: boolean; payload?: { name: string; value: number; }[]; }> = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', p: 1, borderRadius: 1, fontSize: 12 }}>
            <Typography variant="caption" display="block" fontWeight={600}>{payload[0].name}</Typography>
            <Typography variant="caption" color="text.secondary">{fmt(payload[0].value)}</Typography>
        </Box>
    );
};

const BarTooltip: FC<{ active?: boolean; payload?: { name: string; value: number; fill: string; }[]; label?: string; }> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
    return (
        <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', p: 1, borderRadius: 1, fontSize: 12, minWidth: 130 }}>
            <Typography variant="caption" display="block" fontWeight={600} mb={0.5}>{label}</Typography>
            {payload.map(p => (
                <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: p.fill }}>{p.name}</Typography>
                    <Typography variant="caption">{fmt(p.value)}</Typography>
                </Box>
            ))}
            <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 0.5, pt: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" fontWeight={600}>Total</Typography>
                <Typography variant="caption" fontWeight={600}>{fmt(total)}</Typography>
            </Box>
        </Box>
    );
};

// ── mini pie panel ────────────────────────────────────────────────────────────

interface PiePanelProps { title: string; data: { name: string; value: number; }[]; }

const PiePanel: FC<PiePanelProps> = ({ title, data }) => (
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ px: 1 }}>
            {title}
        </Typography>
        {data.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.disabled">No data</Typography>
            </Box>
        ) : (
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={72}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                        iconSize={8}
                        iconType="circle"
                        formatter={(v: string) => <span style={{ fontSize: 11 }}>{v}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        )}
    </Box>
);

// ── main component ────────────────────────────────────────────────────────────

const LedgerCharts: FC = () => {
    const allEntries = useAtomValue(ledgerAtom);
    const [frame, setFrame] = useState<TimeFrame>(TimeFrames.Days30);

    const entries = useMemo(() => {
        const limit = cutoff(frame);
        if (!limit) return allEntries;
        return allEntries.filter(e => new Date(e.date) >= limit);
    }, [allEntries, frame]);

    const byCategory = useMemo(() => groupBy(entries, 'category'), [entries]);
    const byPet = useMemo(() => groupBy(entries, 'petName'), [entries]);
    const timeline = useMemo(() => buildTimeline(entries), [entries]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, py: 1.5 }}>

            {/* ── Pie charts row ── */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <PiePanel title="Spending by Category" data={byCategory} />
                <PiePanel title="Spending by Pet" data={byPet} />
            </Box>

            {/* ── Timeline bar chart ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Spending over time
                </Typography>
                {timeline.length === 0 ? (
                    <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" color="text.disabled">No data for selected period</Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={timeline} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} width={52} />
                            <Tooltip content={<BarTooltip />} />
                            <Legend iconSize={8} formatter={(v: string) => <span style={{ fontSize: 11 }}>{v}</span>} />
                            <Bar dataKey="cart" name="Cart" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="auto" name="Autoship" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {/* Time-frame selector — footer below chart */}
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                    <ButtonGroup size="small" variant="outlined">
                        {(Object.values(TimeFrames) as TimeFrame[]).map(tf => (
                            <Button
                                key={tf}
                                onClick={() => setFrame(tf)}
                                variant={frame === tf ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{ px: 1.5, minWidth: 44, fontSize: 11 }}
                            >
                                {TIME_FRAME_LABELS[tf]}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    );
};

LedgerCharts.displayName = 'LedgerCharts';

export default LedgerCharts;
