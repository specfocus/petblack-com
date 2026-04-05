import { AgentEventTypes } from './agent-event-types';
import agentSetup from './agent-setup';
import type {
    AgentModelResponseReceivedEvent,
    AgentQueueEventsEvent,
    AgentUserMessageReceivedEvent,
} from './agent-events';

const { assign } = agentSetup;

const agentActions = {
    setLastUserMessage: assign(({ event }) => {
        const userMessageEvent = event as AgentUserMessageReceivedEvent;
        return {
            lastUserMessage: userMessageEvent.message,
        };
    }),

    setModelReplyAndQueue: assign(({ context, event }) => {
        const modelResponseEvent = event as AgentModelResponseReceivedEvent;
        return {
            lastReply: modelResponseEvent.reply,
            pendingEvents: [...context.pendingEvents, ...modelResponseEvent.events],
        };
    }),

    queueEvents: assign(({ context, event }) => {
        const queueEvent = event as AgentQueueEventsEvent;
        return {
            pendingEvents: [...context.pendingEvents, ...queueEvent.events],
        };
    }),

    applyAlwaysDecision: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.DecideAlways) return {};
        const selected = context.pendingEvents.find(item => item.id === event.eventId);
        if (!selected) return {};
        return {
            allowlist: context.allowlist.includes(selected.eventType)
                ? context.allowlist
                : [...context.allowlist, selected.eventType],
        };
    }),

    applyNeverDecision: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.DecideNever) return {};
        const selected = context.pendingEvents.find(item => item.id === event.eventId);
        if (!selected) return {};
        return {
            denylist: context.denylist.includes(selected.eventType)
                ? context.denylist
                : [...context.denylist, selected.eventType],
        };
    }),

    removePendingEvent: assign(({ context, event }) => {
        if (
            event.type !== AgentEventTypes.DecideAccept &&
            event.type !== AgentEventTypes.DecideAlways &&
            event.type !== AgentEventTypes.DecideCancel &&
            event.type !== AgentEventTypes.DecideNever &&
            event.type !== AgentEventTypes.EventDispatched &&
            event.type !== AgentEventTypes.EventBlocked
        ) {
            return {};
        }
        return {
            pendingEvents: context.pendingEvents.filter(item => item.id !== event.eventId),
        };
    }),

    setBlockedMessage: assign(({ event }) => {
        if (event.type !== AgentEventTypes.EventBlocked) return {};
        return {
            lastBlockedMessage: event.message,
        };
    }),
};

export default agentActions;
