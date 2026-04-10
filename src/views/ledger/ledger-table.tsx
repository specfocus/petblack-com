"use client";

/**
 * LedgerTable
 *
 * Full-width transaction table using MUI Table (same components used by the
 * Shelly Table wrapper internally).
 * Columns: Date · Product · Category · Pet · Source · Qty · Unit Price · Total
 */

import ledgerAtom from '@/atoms/ledger-atom';
import { ledgerEntryTotal, type LedgerEntry } from '@/domain/ledger-types';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useAtomValue } from '@specfocus/atoms/lib/hooks';
import { useMemo, type FC } from 'react';

// ── helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

const fmtCurrency = (v: number): string =>
    v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const SOURCE_LABEL: Record<string, string> = { cart: 'Cart', auto: 'Autoship' };
const SOURCE_COLOR: Record<string, 'primary' | 'success'> = { cart: 'primary', auto: 'success' };

// ── column header meta ────────────────────────────────────────────────────────

const HEADERS = ['Date', 'Product', 'Category', 'Pet', 'Source', 'Qty', 'Unit Price', 'Total'] as const;

// ── component ─────────────────────────────────────────────────────────────────

const LedgerTable: FC = () => {
    const entries = useAtomValue(ledgerAtom);

    const grandTotal = useMemo(
        () => entries.reduce((s, e) => s + ledgerEntryTotal(e), 0),
        [entries]
    );

    return (
        <MuiTableContainer component={Paper} variant="outlined" sx={{ borderRadius: 0, border: 0 }}>
            <MuiTable size="small" stickyHeader>
                <MuiTableHead>
                    <MuiTableRow>
                        {HEADERS.map(h => (
                            <MuiTableCell key={h}>
                                <Typography variant="caption" fontWeight={600}>{h}</Typography>
                            </MuiTableCell>
                        ))}
                    </MuiTableRow>
                </MuiTableHead>

                <MuiTableBody>
                    {entries.length === 0 ? (
                        <MuiTableRow>
                            <MuiTableCell colSpan={HEADERS.length} align="center">
                                <Typography variant="caption" color="text.disabled">
                                    No purchase history yet. Complete a cart checkout to record entries.
                                </Typography>
                            </MuiTableCell>
                        </MuiTableRow>
                    ) : (
                        entries.map(e => (
                            <MuiTableRow key={e.id} hover>
                                <MuiTableCell>
                                    <Typography variant="caption" noWrap>{fmtDate(e.date)}</Typography>
                                </MuiTableCell>
                                <MuiTableCell sx={{ maxWidth: 220 }}>
                                    <Typography variant="body2" noWrap>{e.name}</Typography>
                                </MuiTableCell>
                                <MuiTableCell>
                                    <Typography variant="caption" noWrap>{e.category}</Typography>
                                </MuiTableCell>
                                <MuiTableCell>
                                    <Typography variant="caption" noWrap>{e.petName}</Typography>
                                </MuiTableCell>
                                <MuiTableCell>
                                    <Chip
                                        label={SOURCE_LABEL[e.source] ?? e.source}
                                        size="small"
                                        color={SOURCE_COLOR[e.source] ?? 'default'}
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: 10 }}
                                    />
                                </MuiTableCell>
                                <MuiTableCell>
                                    <Typography variant="caption">{e.qty}</Typography>
                                </MuiTableCell>
                                <MuiTableCell align="right">
                                    <Typography variant="caption" fontFamily="monospace">
                                        {fmtCurrency(e.unitPrice)}
                                    </Typography>
                                </MuiTableCell>
                                <MuiTableCell align="right">
                                    <Typography variant="caption" fontFamily="monospace" fontWeight={600}>
                                        {fmtCurrency(ledgerEntryTotal(e))}
                                    </Typography>
                                </MuiTableCell>
                            </MuiTableRow>
                        ))
                    )}

                    {/* ── Grand-total footer row ── */}
                    {entries.length > 0 && (
                        <MuiTableRow sx={{ bgcolor: 'action.hover' }}>
                            <MuiTableCell colSpan={HEADERS.length - 1}>
                                <Typography variant="caption" color="text.secondary">
                                    {entries.length} transaction{entries.length !== 1 ? 's' : ''}
                                </Typography>
                            </MuiTableCell>
                            <MuiTableCell align="right">
                                <Typography variant="caption" fontFamily="monospace" fontWeight={700}>
                                    {fmtCurrency(grandTotal)}
                                </Typography>
                            </MuiTableCell>
                        </MuiTableRow>
                    )}
                </MuiTableBody>
            </MuiTable>
        </MuiTableContainer>
    );
};

LedgerTable.displayName = 'LedgerTable';

export default LedgerTable;
