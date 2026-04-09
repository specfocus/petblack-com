"use client";

import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useAtom, useSetAtom } from '@specfocus/atoms/lib/hooks';
import { SwiperEventTypes } from '@specfocus/shelly/lib/layouts/swiper/machine/swiper-event-types';
import shellActorAtom from '@specfocus/shelly/lib/shell/atoms/shell-actor-atom';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { type FC } from 'react';
import { debugViewContext } from '@/views/debug/debug-view-entry';
import debugOpenAtom from './atoms/debug-open-atom';
import debugShowAtom from './atoms/debug-show-atom';
import DebugConsole from './debug-console';

const DebugWidget: FC = () => {
    const [isOpen, setIsOpen] = useAtom(debugOpenAtom);
    const sendShellEvent = useSetAtom(shellActorAtom);

    return (
        <Widget showAtom={debugShowAtom} openAtom={debugOpenAtom} closedIcon={BugReportRoundedIcon}>
            {/* ── Widget Header ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    pl: 3,   // clear the 18px drag-handle notch
                    pr: 0.5, // give the rightmost icon button room to breathe
                    py: 0.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                    flexShrink: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                <BugReportRoundedIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ flex: 1 }}>Buddy Debug Console</Typography>
                <IconButton
                    size="small"
                    onClick={() => sendShellEvent({ type: SwiperEventTypes.PushView, view: debugViewContext })}
                    title="Open debug view"
                >
                    <OpenInFullRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setIsOpen(false)} title="Close">
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* ── Shared console (traces + composer with clear) ── */}
            <DebugConsole variant="widget" />
        </Widget>
    );
};

DebugWidget.displayName = 'DebugWidget';

export default DebugWidget;
