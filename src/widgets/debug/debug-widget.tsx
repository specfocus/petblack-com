"use client";

import { buildBuddyProfile } from '@/widgets/buddy/domain/deterministic';
import { getOrCreateVisitorId } from '@/widgets/buddy/domain/storage';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import agentActorAtom from '@/atoms/agent-actor-atom';
import agentSnapshotDebugTracesAtom from '@/atoms/agent-snapshot-debug-traces-atom';
import agentSnapshotIsSendingAtom from '@/atoms/agent-snapshot-is-sending-atom';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import type { WidgetProps } from '@specfocus/shelly/lib/widgets/widget';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { useMemo, useState, type FC, type FormEvent } from 'react';
import debugToggleAtom from './atoms/debug-toggle-atom';
import { AgentEventTypes } from '@/machines/agent/agent-event-types';

const DebugWidget: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const lines = useAtomValue(agentSnapshotDebugTracesAtom);
    const isSending = useAtomValue(agentSnapshotIsSendingAtom);
    const shopSnapshot = useAtomValue(shopSnapshotAtom);
    const sendAgentEvent = useSetAtom(agentActorAtom);

    const visitorId = useMemo(() => getOrCreateVisitorId(), []);
    const buddyProfile = useMemo(() => buildBuddyProfile(visitorId), [visitorId]);

    const shopMachineDoc = `Debug helper for shop machine.
Allowed event families:
- shop.toggleListEnabled
- shop.createCustomList
- shop.removeCustomList
- shop.addItem
- shop.updateItemQty
- shop.removeItem`;

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || isSending) return;

        setMessage('');
        sendAgentEvent({
            type: AgentEventTypes.BindBuddyProfile,
            profile: buddyProfile,
        });
        sendAgentEvent({
            type: AgentEventTypes.ChatRequestSubmitted,
            payload: {
                visitorId: buddyProfile.visitorId,
                message: trimmed,
                buddy: buddyProfile,
                shopSnapshot: {
                    stateValue: String(shopSnapshot.value),
                    context: shopSnapshot.context,
                },
                shopMachineDoc,
            },
        });
    };

    return (
        <Widget
            openAtom={debugToggleAtom as WidgetProps['openAtom']}
            defaultCorner="bottom-left"
            sx={isOpen ? undefined : { overflow: 'visible', background: 'transparent', boxShadow: 'none' }}
        >
            {isOpen ? (
                <Paper
                    component="section"
                    aria-label="Debug chat panel"
                    elevation={12}
                    sx={{
                        width: { xs: 'calc(100vw - 24px)', sm: 460 },
                        height: { xs: 'calc(100vh - 24px)', sm: 560 },
                        maxWidth: 460,
                        maxHeight: 560,
                        display: 'grid',
                        gridTemplateRows: 'auto 1fr auto',
                        overflow: 'hidden',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 1.5,
                            py: 1,
                            borderBottom: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BugReportRoundedIcon fontSize="small" />
                            <Typography variant="subtitle2">Buddy Debug Console</Typography>
                        </Box>
                        <Box>
                            <IconButton
                                size="small"
                                onClick={() => sendAgentEvent({ type: AgentEventTypes.ClearDebugTraces })}
                                title="Clear transcript"
                            >
                                <ClearAllRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => setIsOpen(false)} title="Close">
                                <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ p: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
                        {lines.length === 0 ? (
                            <Typography variant="caption" color="text.secondary">
                                Send a message to inspect raw request/response payloads.
                            </Typography>
                        ) : (
                            lines.map(line => (
                                <Box
                                    key={line.id}
                                    sx={{
                                        mb: 1,
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor:
                                            line.direction === 'request'
                                                ? 'action.hover'
                                                : line.direction === 'response'
                                                    ? 'success.light'
                                                    : 'error.light',
                                        color: 'text.primary',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.75, mb: 0.5 }}>
                                        [{line.direction.toUpperCase()}] {line.timestamp}
                                    </Typography>
                                    {line.text}
                                </Box>
                            ))
                        )}
                    </Box>

                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{
                            borderTop: 1,
                            borderColor: 'divider',
                            p: 1,
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <InputBase
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Raw user message for /api/buddy/chat"
                            inputProps={{ maxLength: 800 }}
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1.5,
                                px: 1,
                                py: 0.75,
                                fontSize: 13,
                                bgcolor: 'background.default',
                            }}
                        />
                        <IconButton
                            type="submit"
                            disabled={!message.trim() || isSending}
                            color="primary"
                            sx={{ borderRadius: 1.5 }}
                        >
                            <SendRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            ) : (
                <IconButton
                    aria-label="Open debug console"
                    onClick={() => setIsOpen(true)}
                    sx={{
                        width: 54,
                        height: 54,
                        bgcolor: 'warning.dark',
                        color: 'common.white',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                        '&:hover': { bgcolor: 'warning.main' },
                    }}
                >
                    <BugReportRoundedIcon />
                </IconButton>
            )}
        </Widget>
    );
};

DebugWidget.displayName = 'DebugWidget';

export default DebugWidget;
