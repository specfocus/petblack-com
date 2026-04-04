"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { buildBuddyProfile } from "@/features/buddy/domain/deterministic";
import { createBuddySession, updateBuddySessionMood } from "@/features/buddy/domain/session";
import { getOrCreateVisitorId } from "@/features/buddy/domain/storage";
import type { BuddyChatOutput, BuddyProfile } from "@/features/buddy/domain/types";
import styles from "./BuddyWidget.module.css";

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

export function BuddyWidget() {
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

  if (!isOpen) {
    return (
      <button className={styles.launcher} type="button" onClick={() => setIsOpen(true)} aria-label="Open Buddy">
        {speciesEmoji(profile.species)}
      </button>
    );
  }

  return (
    <section className={styles.panel} aria-label="Buddy chat panel">
      <header className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.avatar}>{speciesEmoji(profile.species)}</span>
          <div>
            <p className={styles.title}>{profile.name}</p>
            <p className={styles.subtitle}>
              {profile.rarity} {profile.species}
            </p>
          </div>
        </div>
        <button className={styles.closeButton} type="button" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </header>

      <div className={styles.messages} ref={listRef}>
        {chat.map(line => (
          <p key={line.id} className={line.speaker === "user" ? styles.bubbleUser : styles.bubbleBuddy}>
            {line.text}
          </p>
        ))}
      </div>

      <form className={styles.composer} onSubmit={onSubmit}>
        <input
          className={styles.input}
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder="Ask Buddy about pet care..."
          maxLength={800}
        />
        <button className={styles.sendButton} type="submit" disabled={isSending || !message.trim()}>
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </section>
  );
}
