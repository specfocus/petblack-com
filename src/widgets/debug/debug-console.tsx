"use client";

/**
 * DebugConsole
 *
 * Shared inner content for both the DebugWidget (compact grid panel) and
 * DebugView (full main-view container).
 *
 * `variant="widget"` — tight padding, monospace font-size 12, used inside the
 *                       fixed-size widget slot.
 * `variant="view"`   — relaxed padding and font-size 13, used in the wide
 *                       main slide area.
 */

import agentActorAtom from '@/atoms/agent-actor-atom';
import agentSnapshotDebugTracesAtom from '@/atoms/agent-snapshot-debug-traces-atom';
import agentSnapshotIsSendingAtom from '@/atoms/agent-snapshot-is-sending-atom';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { AgentEventTypes } from '@/machines/agent/agent-event-types';
import { buildBuddyProfile } from '@/widgets/buddy/domain/deterministic';
import { getOrCreateVisitorId } from '@/widgets/buddy/domain/storage';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import { useMemo, useRef, useState, type FC, type FormEvent, type MouseEvent } from 'react';
import { BUDDY_PREFAB_REQUESTS } from './prefab-requests';

// ── types ─────────────────────────────────────────────────────────────────────

export type DebugConsoleVariant = 'widget' | 'view';

export interface DebugConsoleProps {
    variant: DebugConsoleVariant;
}

// ── constants ─────────────────────────────────────────────────────────────────

const PREFAB_TOKEN_REGEX = /^##([a-z0-9-]+)##$/i;

const SHOP_MACHINE_DOC = `Debug helper for shop machine.
Allowed event families:
- shop.toggleBucketShow
- shop.createCustomBucket
- shop.removeCustomBucket
- shop.addItem
- shop.updateItemQty
- shop.removeItem

Terminology:
- bucketName maps to bucket id in toggle/remove events`;

// ── component ─────────────────────────────────────────────────────────────────

const DebugConsole: FC<DebugConsoleProps> = ({ variant }) => {
    const [message, setMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [copiedTraceId, setCopiedTraceId] = useState<string | null>(null);
    const inputBoxRef = useRef<HTMLDivElement>(null);

    const lines = useAtomValue(agentSnapshotDebugTracesAtom);
    const isSending = useAtomValue(agentSnapshotIsSendingAtom);
    const shopSnapshot = useAtomValue(shopSnapshotAtom);
    const sendAgentEvent = useSetAtom(agentActorAtom);

    const visitorId = useMemo(() => getOrCreateVisitorId(), []);
    const buddyProfile = useMemo(() => buildBuddyProfile(visitorId), [visitorId]);

    const prefabItems = useMemo(
        () => BUDDY_PREFAB_REQUESTS.map(request => ({
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

    const isPrefabMenuOpen = menuOpen;

    const handleOpenPrefabMenu = (_event: MouseEvent<HTMLElement>) => {
        setMenuOpen(true);
    };
    const handleClosePrefabMenu = () => setMenuOpen(false);
    const handlePickPrefabMessage = (prefabToken: string) => {
        setMessage(prefabToken);
        setMenuOpen(false);
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
        const resolvedMessage = resolveInputToMessage(message.trim());
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
                shopMachineDoc: SHOP_MACHINE_DOC,
            },
        });
    };

    const isView = variant === 'view';
    const traceFontSize = isView ? 13 : 12;
    const tracePadding = isView ? 1.5 : 1;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minWidth: 0 }}>
            {/* ── Traces ── */}
            <Box
                sx={{
                    p: tracePadding,
                    overflowY: 'auto',
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: traceFontSize,
                    userSelect: 'text',
                    WebkitUserSelect: 'text',
                    width: '100%',
                    minWidth: 0,
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
                                p: tracePadding,
                                pb: 3.5,
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

            {/* ── Composer ── */}
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                    borderTop: 1,
                    borderColor: 'divider',
                    p: tracePadding,
                    display: 'flex',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: '100%',
                    minWidth: 0,
                }}
            >
                {/* Inner row — capped at 768px (iPad portrait) on large screens */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: 1,
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: isView ? 768 : '100%',
                    }}
                >
                    {/* Clear button — before the input */}
                    <IconButton
                        size="small"
                        onClick={() => sendAgentEvent({ type: AgentEventTypes.ClearDebugTraces })}
                        title="Clear transcript"
                    >
                        <ClearAllRoundedIcon fontSize="small" />
                    </IconButton>

                    <Box
                        ref={inputBoxRef}
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            bgcolor: 'background.default',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <InputBase
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type or select a debug request"
                            inputProps={{ maxLength: 800 }}
                            sx={{
                                px: 1,
                                py: 0.75,
                                fontSize: isView ? 14 : 13,
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
                        anchorEl={inputBoxRef.current}
                        open={isPrefabMenuOpen}
                        onClose={handleClosePrefabMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    maxHeight: 360,
                                    width: inputBoxRef.current?.offsetWidth ?? 'auto',
                                    minWidth: inputBoxRef.current?.offsetWidth ?? 0,
                                },
                            },
                        }}
                    >
                        {prefabItems.map(prefab => (
                            <MenuItem
                                key={prefab.id}
                                onClick={() => handlePickPrefabMessage(prefab.token)}
                                dense
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                        {prefab.token}
                                    </Typography>
                                    <Typography variant="body2">{prefab.message}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Menu>
                    <IconButton type="submit" disabled={!message.trim() || isSending} color="primary">
                        <SendRoundedIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

DebugConsole.displayName = 'DebugConsole';

export default DebugConsole;
