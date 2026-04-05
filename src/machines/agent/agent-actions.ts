import { AgentEventTypes } from './agent-event-types';
import agentSetup from './agent-setup';
import type {
    AgentBindBuddyProfileEvent,
    AgentChatRequestSubmittedEvent,
    AgentChatRequestSucceededEvent,
    AgentEventEnvelope,
    AgentModelResponseReceivedEvent,
    AgentQueueEventsEvent,
    AgentUserMessageReceivedEvent,
} from './agent-events';
import type { BuddyProfile } from '@/widgets/buddy/domain/types';
import { ShopEventTypes } from '../shop/shop-event-types';
import type { ShopEventUnion } from '../shop/shop-events';

const { assign } = agentSetup;

const makeId = (): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const now = (): string => new Date().toISOString();

const serialize = (value: unknown): string => {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};

const toString = (value: unknown): string | null =>
    typeof value === 'string' && value.length > 0 ? value : null;

const toNumber = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value) ? value : null;

const toBoolean = (value: unknown, fallback: boolean): boolean =>
    typeof value === 'boolean' ? value : fallback;

const translateProposedEventsToShopEvents = (events: AgentEventEnvelope[]): ShopEventUnion[] => {
    const translated: ShopEventUnion[] = [];
    for (const event of events) {
        if (event.target !== 'shop') continue;
        const payload = event.payload ?? {};
        switch (event.eventType) {
            case ShopEventTypes.OpenCart:
                translated.push({ type: ShopEventTypes.OpenCart });
                break;
            case ShopEventTypes.OpenAutoship:
                translated.push({ type: ShopEventTypes.OpenAutoship });
                break;
            case ShopEventTypes.ToggleListEnabled: {
                const id = toString(payload.id) ?? 'cart';
                const enabled = toBoolean(payload.enabled, true);
                translated.push({ type: ShopEventTypes.ToggleListEnabled, id, enabled });
                if (id === 'cart' && enabled) translated.push({ type: ShopEventTypes.OpenCart });
                break;
            }
            case ShopEventTypes.AddItem: {
                const bucketName = toString(payload.bucketName) ?? 'cart';
                const sku = toString(payload.sku) ?? 'unknown-sku';
                const name = toString(payload.name) ?? 'Unknown item';
                const qty = toNumber(payload.qty) ?? 1;
                translated.push({ type: ShopEventTypes.AddItem, bucketName, sku, name, qty });
                break;
            }
            case ShopEventTypes.UpdateItemQty: {
                const bucketName = toString(payload.bucketName) ?? 'cart';
                const sku = toString(payload.sku) ?? 'unknown-sku';
                const qty = toNumber(payload.qty) ?? 1;
                translated.push({ type: ShopEventTypes.UpdateItemQty, bucketName, sku, qty });
                break;
            }
            case ShopEventTypes.RemoveItem: {
                const bucketName = toString(payload.bucketName) ?? 'cart';
                const sku = toString(payload.sku) ?? 'unknown-sku';
                translated.push({ type: ShopEventTypes.RemoveItem, bucketName, sku });
                break;
            }
            case ShopEventTypes.ClearCart:
                translated.push({ type: ShopEventTypes.ClearCart });
                break;
            case ShopEventTypes.SearchProducts:
                translated.push({ type: ShopEventTypes.SearchProducts, query: toString(payload.query) ?? '' });
                break;
            default:
                break;
        }
    }
    return translated;
};

const agentActions = {
    bindBuddyProfile: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.BindBuddyProfile) return {};
        const bindEvent = event as AgentBindBuddyProfileEvent;
        const hasGreeting = context.conversation.some(line => line.speaker === 'buddy');
        if (hasGreeting) {
            return { buddyProfile: bindEvent.profile as BuddyProfile };
        }
        return {
            buddyProfile: bindEvent.profile as BuddyProfile,
            conversation: [
                ...context.conversation,
                {
                    id: makeId(),
                    speaker: 'buddy' as const,
                    text: `Hi, I am ${bindEvent.profile.name} the ${bindEvent.profile.species}. Ask me anything about caring for your pet friends.`,
                    timestamp: now(),
                },
            ],
        };
    }),

    markRequestStarted: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.ChatRequestSubmitted) return {};
        const submitEvent = event as AgentChatRequestSubmittedEvent;
        return {
            isSending: true,
            lastUserMessage: submitEvent.payload.message,
            pendingPayloadJson: serialize(submitEvent.payload),
            pendingPayload: submitEvent.payload,
            conversation: [
                ...context.conversation,
                {
                    id: makeId(),
                    speaker: 'user' as const,
                    text: submitEvent.payload.message,
                    timestamp: now(),
                },
            ],
            debugTraces: [
                ...context.debugTraces,
                {
                    id: makeId(),
                    direction: 'request' as const,
                    text: serialize(submitEvent.payload),
                    timestamp: now(),
                },
            ],
        };
    }),

    applyChatSuccess: assign(({ context, event }) => {
        const doneEvent = event as unknown as { output: AgentChatRequestSucceededEvent; };
        const output = doneEvent.output;
        const parsed = output.parsed;
        const debugResponse = {
            status: output.status,
            ok: output.ok,
            parsed,
            rawText: output.rawText,
        };
        const nextConversation = parsed?.reply
            ? [
                ...context.conversation,
                {
                    id: makeId(),
                    speaker: 'buddy' as const,
                    text: parsed.reply,
                    timestamp: now(),
                },
            ]
            : context.conversation;

        const translatedShopEvents = parsed?.events
            ? translateProposedEventsToShopEvents(parsed.events)
            : [];

        return {
            isSending: false,
            lastReply: parsed?.reply ?? context.lastReply,
            pendingPayloadJson: null,
            pendingPayload: null,
            conversation: nextConversation,
            pendingEvents: parsed?.events
                ? [...context.pendingEvents, ...parsed.events]
                : context.pendingEvents,
            forwardedShopEvents: [...context.forwardedShopEvents, ...translatedShopEvents],
            debugTraces: [
                ...context.debugTraces,
                {
                    id: makeId(),
                    direction: 'response' as const,
                    text: serialize(debugResponse),
                    timestamp: now(),
                },
            ],
        };
    }),

    applyChatError: assign(({ context, event }) => {
        const errorMessage = (() => {
            const maybeError = event as { error?: unknown; };
            if (maybeError?.error instanceof Error) return maybeError.error.message;
            return 'Buddy request failed';
        })();
        return {
            isSending: false,
            pendingPayloadJson: null,
            pendingPayload: null,
            debugTraces: [
                ...context.debugTraces,
                {
                    id: makeId(),
                    direction: 'error' as const,
                    text: errorMessage,
                    timestamp: now(),
                },
            ],
            conversation: [
                ...context.conversation,
                {
                    id: makeId(),
                    speaker: 'buddy' as const,
                    text: 'My whiskers lost signal for a moment. Try again in a second.',
                    timestamp: now(),
                },
            ],
        };
    }),

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

    enqueueForwardShopEvent: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.ForwardShopEvent) return {};
        return {
            forwardedShopEvents: [...context.forwardedShopEvents, event.shopEvent],
        };
    }),

    enqueueForwardShellEvent: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.ForwardShellEvent) return {};
        return {
            forwardedShellEvents: [...context.forwardedShellEvents, event.shellEvent],
        };
    }),

    consumeForwardedShopEvent: assign(({ context }) => ({
        forwardedShopEvents: context.forwardedShopEvents.slice(1),
    })),

    consumeForwardedShellEvent: assign(({ context }) => ({
        forwardedShellEvents: context.forwardedShellEvents.slice(1),
    })),

    // Intents are intentionally scaffolded first and translated incrementally.
    // For now they emit placeholder shop events to guide future implementation.
    translateIntentOpenCart: assign(({ context }) => ({
        forwardedShopEvents: [
            ...context.forwardedShopEvents,
            { type: ShopEventTypes.OpenCart },
        ],
    })),

    translateIntentOpenAutoship: assign(({ context }) => ({
        forwardedShopEvents: [
            ...context.forwardedShopEvents,
            { type: ShopEventTypes.OpenAutoship },
        ],
    })),

    translateIntentAddToyToCart: assign(({ context }) => ({
        forwardedShopEvents: [
            ...context.forwardedShopEvents,
            {
                type: ShopEventTypes.AddItem,
                bucketName: 'cart',
                sku: 'toy-placeholder',
                name: 'Toy (placeholder)',
                qty: 1,
            },
        ],
    })),

    translateIntentAddDogFoodToCart: assign(({ context }) => ({
        forwardedShopEvents: [
            ...context.forwardedShopEvents,
            {
                type: ShopEventTypes.SearchProducts,
                query: 'dog food',
            },
            {
                type: ShopEventTypes.AddItem,
                bucketName: 'cart',
                sku: 'dog-food-placeholder',
                name: 'Dog food (placeholder)',
                qty: 1,
            },
        ],
    })),

    translateIntentCleanCart: assign(({ context }) => ({
        forwardedShopEvents: [
            ...context.forwardedShopEvents,
            { type: ShopEventTypes.ClearCart },
        ],
    })),

    clearDebugTraces: assign(() => ({
        debugTraces: [],
    })),

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
            allowbucket: context.allowbucket.includes(selected.eventType)
                ? context.allowbucket
                : [...context.allowbucket, selected.eventType],
        };
    }),

    applyNeverDecision: assign(({ context, event }) => {
        if (event.type !== AgentEventTypes.DecideNever) return {};
        const selected = context.pendingEvents.find(item => item.id === event.eventId);
        if (!selected) return {};
        return {
            denybucket: context.denybucket.includes(selected.eventType)
                ? context.denybucket
                : [...context.denybucket, selected.eventType],
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
