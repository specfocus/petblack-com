"use client";

const VISITOR_ID_KEY = "petblack.buddy.visitorId";

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `visitor-${Date.now()}`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") {
    return "server-visitor";
  }

  const existing = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existing) {
    return existing;
  }

  const next = createVisitorId();
  window.localStorage.setItem(VISITOR_ID_KEY, next);
  return next;
}
