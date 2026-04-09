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
import { PrefabBucketNames } from '@/domain/types';
import { WIDGETS_PATH } from '@/widgets/widgets-path';
import { ShellEventTypes } from '@specfocus/shelly/lib/shell/machine/shell-event-types';
import { ShellEffectTaskTypes } from '@specfocus/shelly/lib/shell/machine/shell-effect-task';
import type { EnqueueEffectTasksEvent } from '@specfocus/shelly/lib/shell/machine/shell-events';

const { assign } = agentSetup;

/** Build a shell event that toggles a widget panel open+visible. */
const buildOpenWidgetShellEvent = (widgetName: string): EnqueueEffectTasksEvent => ({
    type: ShellEventTypes.EnqueueEffectTasks,
    tasks: [
        {
            type: ShellEffectTaskTypes.ToggleWorkspacePath,
            path: [...WIDGETS_PATH, widgetName, 'toggles', 'show'],
            value: true,
        },
        {
            type: ShellEffectTaskTypes.ToggleWorkspacePath,
            path: [...WIDGETS_PATH, widgetName, 'toggles', 'open'],
            value: true,
        },
    ],
});

/** Build a shell event that only toggles a widget's show flag (icon visible, panel may stay closed). */
const buildShowWidgetShellEvent = (widgetName: string, value: boolean): EnqueueEffectTasksEvent => ({
    type: ShellEventTypes.EnqueueEffectTasks,
    tasks: [
        {
            type: ShellEffectTaskTypes.ToggleWorkspacePath,
            path: [...WIDGETS_PATH, widgetName, 'toggles', 'show'],
            value,
        },
    ],
});

/** Build a shell event that only toggles a widget's open flag (expand/collapse the panel). */
const buildToggleOpenWidgetShellEvent = (widgetName: string, value: boolean): EnqueueEffectTasksEvent => ({
    type: ShellEventTypes.EnqueueEffectTasks,
    tasks: [
        {
            type: ShellEffectTaskTypes.ToggleWorkspacePath,
            path: [...WIDGETS_PATH, widgetName, 'toggles', 'open'],
            value,
        },
    ],
});

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

const translateProposedEventsToShopEvents = (events: AgentEventEnvelope[]): ShopEventUnion[] => {
    const translated: ShopEventUnion[] = [];
    for (const event of events) {
        if (event.target !== 'shop') continue;
        const payload = event.payload ?? {};
        switch (event.eventType) {
            case ShopEventTypes.AddItem: {
                const bucketName = toString(payload.bucketName);
                const sku = toString(payload.sku);
                const name = toString(payload.name);
                const qty = toNumber(payload.qty) ?? 1;
                if (!bucketName || !sku || !name) break;
                translated.push({ type: ShopEventTypes.AddItem, bucketName, sku, name, qty });
                break;
            }
            case ShopEventTypes.UpdateItemQty: {
                const bucketName = toString(payload.bucketName);
                const sku = toString(payload.sku);
                const qty = toNumber(payload.qty);
                if (!bucketName || !sku || qty === null) break;
                translated.push({ type: ShopEventTypes.UpdateItemQty, bucketName, sku, qty });
                break;
            }
            case ShopEventTypes.RemoveItem: {
                const bucketName = toString(payload.bucketName);
                const sku = toString(payload.sku);
                if (!bucketName || !sku) break;
                translated.push({ type: ShopEventTypes.RemoveItem, bucketName, sku });
                break;
            }
            case ShopEventTypes.ClearCart:
                translated.push({ type: ShopEventTypes.ClearCart });
                break;
            case ShopEventTypes.SearchProducts: {
                const query = toString(payload.query);
                if (!query) break;
                translated.push({ type: ShopEventTypes.SearchProducts, query });
                break;
            }
            default:
                break;
        }
    }
    return translated;
};

/** Extract proposed events that should become shell-level UI actions (e.g. open a widget panel). */
const translateProposedEventsToShellEvents = (events: AgentEventEnvelope[]): EnqueueEffectTasksEvent[] => {
    const translated: EnqueueEffectTasksEvent[] = [];
    for (const event of events) {
        if (event.target !== 'shop') continue;
        const payload = event.payload ?? {};
        switch (event.eventType) {
            case ShopEventTypes.OpenBucket: {
                // openBucket = ensure both show and open are true (show icon + expand panel)
                const name = toString(payload.name ?? payload.id);
                if (!name) break;
                translated.push(buildOpenWidgetShellEvent(name));
                break;
            }
            case ShopEventTypes.ToggleBucketShow: {
                // toggleBucketShow = toggle the icon visibility only (does not expand the panel)
                const name = toString(payload.name ?? payload.id);
                if (!name) break;
                translated.push(buildShowWidgetShellEvent(name, true));
                break;
            }
            case ShopEventTypes.ToggleBucketOpen: {
                // toggleBucketOpen = expand or collapse the panel (icon stays visible)
                const name = toString(payload.name ?? payload.id);
                if (!name) break;
                translated.push(buildToggleOpenWidgetShellEvent(name, true));
                break;
            }
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

        const translatedShellEvents = parsed?.events
            ? translateProposedEventsToShellEvents(parsed.events)
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
            forwardedShellEvents: [...context.forwardedShellEvents, ...translatedShellEvents],
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
        forwardedShellEvents: [
            ...context.forwardedShellEvents,
            buildOpenWidgetShellEvent('cart'),
        ],
    })),

    translateIntentOpenAutoship: assign(({ context }) => ({
        forwardedShellEvents: [
            ...context.forwardedShellEvents,
            buildOpenWidgetShellEvent('auto'),
        ],
    })),

    translateIntentAddToyToCart: assign(({ context }) => ({
        forwardedShopEvents: [
            ...context.forwardedShopEvents,
            {
                type: ShopEventTypes.AddItem,
                bucketName: PrefabBucketNames.Cart,
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
                bucketName: PrefabBucketNames.Cart,
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
