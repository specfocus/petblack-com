"use client";

import agentActorAtom from '@/atoms/agent-actor-atom';
import agentSnapshotDebugTracesAtom from '@/atoms/agent-snapshot-debug-traces-atom';
import agentSnapshotIsSendingAtom from '@/atoms/agent-snapshot-is-sending-atom';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { AgentEventTypes } from '@/machines/agent/agent-event-types';
import { buildBuddyProfile } from '@/widgets/buddy/domain/deterministic';
import { getOrCreateVisitorId } from '@/widgets/buddy/domain/storage';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import type { WidgetProps } from '@specfocus/shelly/lib/widgets/widget';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { useMemo, useState, type FC, type FormEvent, type MouseEvent } from 'react';
import debugOpenAtom from './atoms/debug-open-atom';
import debugShowAtom from './atoms/debug-show-atom';
import { BUDDY_PREFAB_REQUESTS } from './prefab-requests';

const PREFAB_TOKEN_REGEX = /^##([a-z0-9-]+)##$/i;

const DebugWidget: FC = () => {
    const [isOpen, setIsOpen] = useAtom(debugOpenAtom);
    const [message, setMessage] = useState('');
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [copiedTraceId, setCopiedTraceId] = useState<string | null>(null);
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
- shop.removeItem

Terminology:
- bucketName maps to bucket id in toggle/remove events`;
    const prefabItems = useMemo(
        () => BUDDY_PREFAB_REQUESTS.map((request) => ({
            id: request.id,
            token: `##${request.id}##`,
            message: request.message,
        })),
        []
    );
    const resolveInputToMessage = (rawInput: string): string => {
        const trimmed = rawInput.trim();
        const tokenMatch = trimmed.match(PREFAB_TOKEN_REGEX);
        if (!tokenMatch?.[1]) return trimmed;
        const match = prefabItems.find(item => item.id.toLowerCase() === tokenMatch[1].toLowerCase());
        return match?.message ?? trimmed;
    };
    const isPrefabMenuOpen = Boolean(menuAnchorEl);

    const handleOpenPrefabMenu = (event: MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleClosePrefabMenu = () => {
        setMenuAnchorEl(null);
    };

    const handlePickPrefabMessage = (prefabToken: string) => {
        setMessage(prefabToken);
        setMenuAnchorEl(null);
    };

    const handleCopyTrace = async (traceId: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedTraceId(traceId);
            window.setTimeout(() => {
                setCopiedTraceId(prev => (prev === traceId ? null : prev));
            }, 1200);
        } catch {
            // best-effort copy only
        }
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = message.trim();
        const resolvedMessage = resolveInputToMessage(trimmed);
        if (!resolvedMessage || isSending) return;

        setMessage('');
        sendAgentEvent({
            type: AgentEventTypes.BindBuddyProfile,
            profile: buddyProfile,
        });
        sendAgentEvent({
            type: AgentEventTypes.ChatRequestSubmitted,
            payload: {
                visitorId: buddyProfile.visitorId,
                message: resolvedMessage,
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
            openAtom={debugShowAtom as WidgetProps['openAtom']}
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

                    <Box
                        sx={{
                            p: 1,
                            overflowY: 'auto',
                            fontFamily: 'monospace',
                            fontSize: 12,
                            userSelect: 'text',
                            WebkitUserSelect: 'text',
                        }}
                    >
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
                                        pb: 3.5,
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
                                        position: 'relative',
                                        userSelect: 'text',
                                        WebkitUserSelect: 'text',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.75, mb: 0.5 }}>
                                        [{line.direction.toUpperCase()}] {line.timestamp}
                                    </Typography>
                                    <Box component="pre" sx={{ m: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                                        {line.text}
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleCopyTrace(line.id, line.text)}
                                        title="Copy message"
                                        sx={{
                                            position: 'absolute',
                                            right: 6,
                                            bottom: 6,
                                            bgcolor: 'rgba(0,0,0,0.08)',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.14)' },
                                        }}
                                    >
                                        {copiedTraceId === line.id
                                            ? <CheckRoundedIcon fontSize="inherit" />
                                            : <ContentCopyRoundedIcon fontSize="inherit" />}
                                    </IconButton>
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
                        <Box sx={{ width: '100%' }}>
                            <Box
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1.5,
                                    bgcolor: 'background.default',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <InputBase
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type or select a debug request"
                                    inputProps={{ maxLength: 800 }}
                                    sx={{
                                        px: 1,
                                        py: 0.75,
                                        fontSize: 13,
                                        flex: 1,
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={handleOpenPrefabMenu}
                                    title="Select prefab message"
                                    sx={{ mr: 0.5 }}
                                >
                                    <KeyboardArrowDownRoundedIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Menu
                                anchorEl={menuAnchorEl}
                                open={isPrefabMenuOpen}
                                onClose={handleClosePrefabMenu}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            >
                                {prefabItems.map((prefab) => (
                                    <MenuItem
                                        key={prefab.id}
                                        onClick={() => handlePickPrefabMessage(prefab.token)}
                                        dense
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                                {prefab.token}
                                            </Typography>
                                            <Typography variant="body2">
                                                {prefab.message}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
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
