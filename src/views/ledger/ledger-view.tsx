"use client";

/**
 * LedgerView
 *
 * Full-width purchase-history view.
 *
 * Layout:
 *   ┌─ header ────────────────────────────────────────┐
 *   ├─ Accordion: Charts ──────────────────────────── ┤  (default: expanded)
 *   │    Two pie charts + stacked timeline bar chart  │
 *   │    Footer: time-frame selector                  │
 *   ├─ Accordion: Transactions ──────────────────────┤  (default: expanded)
 *   │    Full-width stickyHeader table                │
 *   └─────────────────────────────────────────────── ┘
 */

import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type FC } from 'react';
import LedgerCharts from './ledger-charts';
import LedgerTable from './ledger-table';

// ── component ─────────────────────────────────────────────────────────────────

const LedgerView: FC = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
        }}
    >
        {/* ── View header ── */}
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                flexShrink: 0,
            }}
        >
            <ReceiptLongRoundedIcon fontSize="small" color="action" />
            <Typography variant="subtitle2">Purchase History</Typography>
        </Box>

        {/* ── Scrollable body ── */}
        <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* ── Charts accordion ── */}
            <Accordion
                defaultExpanded
                disableGutters
                elevation={0}
                square
                sx={{ '&:before': { display: 'none' }, borderBottom: 1, borderColor: 'divider' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.75 } }}>
                    <Typography variant="subtitle2">Charts</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                    <LedgerCharts />
                </AccordionDetails>
            </Accordion>

            {/* ── Table accordion ── */}
            <Accordion
                defaultExpanded
                disableGutters
                elevation={0}
                square
                sx={{ '&:before': { display: 'none' }, flex: 1 }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: 40, borderBottom: 1, borderColor: 'divider', '& .MuiAccordionSummary-content': { my: 0.75 } }}>
                    <Typography variant="subtitle2">Transactions</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                    <LedgerTable />
                </AccordionDetails>
            </Accordion>

        </Box>
    </Box>
);

LedgerView.displayName = 'LedgerView';

export default LedgerView;
