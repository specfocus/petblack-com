"use client";

import DebugConsole from '@/widgets/debug/debug-console';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { type FC } from 'react';

/**
 * DebugView
 *
 * Full-width main-view version of the Buddy Debug Console.
 * Rendered as the primary component of the debug view entry.
 * Reuses <DebugConsole variant="view" /> from the debug widget package.
 */
const DebugView: FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* ── View Header ── */}
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
                <BugReportRoundedIcon fontSize="small" color="action" />
                <Typography variant="subtitle2">
                    Buddy Debug Console
                </Typography>
            </Box>

            {/* ── Console body (traces + composer with clear) ── */}
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <DebugConsole variant="view" />
            </Box>
        </Box>
    );
};

DebugView.displayName = 'DebugView';

export default DebugView;
