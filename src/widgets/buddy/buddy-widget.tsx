"use client";

/**
 * BuddyWidgetWrapper
 *
 * Zero-prop wrapper registered with shelly's `widgetRegistrationAtom`.
 * `<Widgets />` mounts this component while the buddy toggle is open.
 *
 * Delegates drag, snap-to-corner, and show/hide to shelly's <Widget> shell.
 * <BuddyWidget> is a pure chat UI with no positioning concerns of its own.
 */

import { buildBuddyProfile } from "@/widgets/buddy/domain/deterministic";
import { createBuddySession, updateBuddySessionMood } from "@/widgets/buddy/domain/session";
import { getOrCreateVisitorId } from "@/widgets/buddy/domain/storage";
import type { BuddyChatOutput, BuddyProfile } from "@/widgets/buddy/domain/types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { WidgetProps } from '@specfocus/shelly/lib/widgets/widget';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { FormEvent, useEffect, useMemo, useRef, useState, type FC } from "react";
import buddyToggleAtom from './atoms/buddy-toggle-atom';

interface ChatLine {
    id: string;
    speaker: "buddy" | "user";
    text: string;
}

function speciesEmoji(species: BuddyProfile["species"]): string {
    const map: Record<BuddyProfile["species"], string> = {
        cat: "🐈",
        dog: "🐕",
        rabbit: "🐇",
        turtle: "🐢",
        bird: "🐦",
        fish: "🐠",
        axolotl: "🦎",
        capybara: "🦫",
    };
    return map[species];
}

function makeId(prefix: string): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const BuddyWidget: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [chat, setChat] = useState<ChatLine[]>([]);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const id = getOrCreateVisitorId();
        setVisitorId(id);
    }, []);

    const profile = useMemo(() => {
        if (!visitorId) {
            return null;
        }
        return buildBuddyProfile(visitorId);
    }, [visitorId]);

    const [session, setSession] = useState(() => (profile ? createBuddySession(profile) : null));

    useEffect(() => {
        if (!profile) {
            return;
        }
        setSession(createBuddySession(profile));
        setChat([
            {
                id: makeId("buddy"),
                speaker: "buddy",
                text: `Hi, I am ${profile.name} the ${profile.species}. Ask me anything about caring for your pet friends.`,
            },
        ]);
    }, [profile]);

    useEffect(() => {
        const node = listRef.current;
        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    }, [chat]);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        if (!profile || !message.trim() || isSending) {
            return;
        }

        const userLine: ChatLine = { id: makeId("user"), speaker: "user", text: message.trim() };
        setChat(prev => [...prev, userLine]);
        setMessage("");
        setIsSending(true);

        try {
            const response = await fetch("/api/buddy/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: profile.visitorId,
                    message: userLine.text,
                    buddy: profile,
                }),
            });

            let modelReply = "I had a little hiccup. Could you ask that again?";
            let modelEmotion = session?.mood;
            if (response.ok) {
                const data = (await response.json()) as BuddyChatOutput;
                modelReply = data.reply;
                modelEmotion = data.emotion;
            }

            if (modelEmotion) {
                setSession(prev => (prev ? updateBuddySessionMood(prev, modelEmotion) : prev));
            }

            setChat(prev => [
                ...prev,
                {
                    id: makeId("buddy"),
                    speaker: "buddy",
                    text: modelReply,
                },
            ]);
        } catch {
            setChat(prev => [
                ...prev,
                {
                    id: makeId("buddy"),
                    speaker: "buddy",
                    text: "My whiskers lost signal for a moment. Try again in a second.",
                },
            ]);
        } finally {
            setIsSending(false);
        }
    }

    if (!profile) {
        return null;
    }

    return (
        <Widget
            openAtom={buddyToggleAtom as WidgetProps['openAtom']}
            defaultCorner="bottom-right"
            sx={isOpen ? undefined : { overflow: 'visible', background: 'transparent', boxShadow: 'none' }}
        >
            {isOpen ? (
                <Paper
                    component="section"
                    aria-label="Buddy chat panel"
                    elevation={12}
                    sx={{
                        width: { xs: "calc(100vw - 24px)", sm: 380 },
                        height: { xs: "calc(100vh - 24px)", sm: 560 },
                        maxWidth: 380,
                        maxHeight: 560,
                        display: "grid",
                        gridTemplateRows: "auto 1fr auto",
                        overflow: "hidden",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                    }}
                >
                    {/* ── Header ── */}
                    <Box
                        component="header"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 1.75,
                            py: 1.5,
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", minWidth: 0 }}>
                            <Typography component="span" sx={{ fontSize: 26, lineHeight: 1 }}>
                                {speciesEmoji(profile.species)}
                            </Typography>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} noWrap>
                                    {profile.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                    {profile.rarity} {profile.species}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            size="small"
                            aria-label="Close Buddy"
                            onClick={() => setIsOpen(false)}
                        >
                            <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* ── Messages ── */}
                    <Box
                        ref={listRef}
                        sx={{
                            overflowY: "auto",
                            p: 1.75,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.25,
                        }}
                    >
                        {chat.map(line => (
                            <Box
                                key={line.id}
                                sx={{
                                    alignSelf: line.speaker === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "82%",
                                    bgcolor: line.speaker === "user" ? "primary.main" : "action.hover",
                                    color: line.speaker === "user" ? "primary.contrastText" : "text.primary",
                                    borderRadius:
                                        line.speaker === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                                    px: 1.5,
                                    py: 1.25,
                                    fontSize: 14,
                                    lineHeight: 1.4,
                                }}
                            >
                                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                    {line.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* ── Composer ── */}
                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{
                            borderTop: 1,
                            borderColor: "divider",
                            p: 1.25,
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: 1,
                            alignItems: "center",
                        }}
                    >
                        <InputBase
                            value={message}
                            onChange={event => setMessage(event.target.value)}
                            placeholder="Ask Buddy about pet care…"
                            inputProps={{ maxLength: 800 }}
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2.5,
                                px: 1.5,
                                py: 1.25,
                                fontSize: 14,
                                bgcolor: "background.default",
                            }}
                        />
                        <IconButton
                            type="submit"
                            aria-label="Send"
                            disabled={isSending || !message.trim()}
                            color="success"
                            sx={{
                                bgcolor: "success.main",
                                color: "common.white",
                                borderRadius: 2.5,
                                p: 1.25,
                                "&:hover": { bgcolor: "success.dark" },
                                "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
                            }}
                        >
                            <SendRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            ) : (
                <IconButton
                    aria-label="Open Buddy"
                    onClick={() => setIsOpen(true)}
                    sx={{
                        width: 60,
                        height: 60,
                        bgcolor: "grey.900",
                        color: "common.white",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                        "&:hover": { bgcolor: "grey.800" },
                    }}
                >
                    <PetsRoundedIcon sx={{ fontSize: 30 }} />
                </IconButton>
            )
            }
        </Widget >
    );
};

BuddyWidget.displayName = 'BuddyWidgetWrapper';

export default BuddyWidget;

