import type { AgentEventTypes } from './agent-event-types';
import type { BuddyChatInput, BuddyChatOutput, BuddyProfile } from '@/widgets/buddy/domain/types';
import type { ShopEventUnion } from '../shop/shop-events';
import type { ShellEventUnion } from '@specfocus/shelly/lib/shell/machine/shell-events';

export interface AgentConversationMessage {
    id: string;
    speaker: 'user' | 'buddy';
    text: string;
    timestamp: string;
}

export interface AgentDebugTrace {
    id: string;
    direction: 'request' | 'response' | 'error';
    text: string;
    timestamp: string;
}

export interface AgentEventEnvelope {
    id: string;
    target: 'shop';
    eventType: string;
    payload?: Record<string, unknown>;
    reason?: string;
}

export interface AgentBindBuddyProfileEvent {
    type: `${AgentEventTypes.BindBuddyProfile}`;
    profile: BuddyProfile;
}

export interface AgentChatRequestSubmittedEvent {
    type: `${AgentEventTypes.ChatRequestSubmitted}`;
    payload: BuddyChatInput;
}

export interface AgentUserMessageReceivedEvent {
    type: `${AgentEventTypes.UserMessageReceived}`;
    message: string;
}

export interface AgentModelResponseReceivedEvent {
    type: `${AgentEventTypes.ModelResponseReceived}`;
    reply: string;
    events: AgentEventEnvelope[];
}

export interface AgentQueueEventsEvent {
    type: `${AgentEventTypes.QueueEvents}`;
    events: AgentEventEnvelope[];
}

export interface AgentForwardShopEvent {
    type: `${AgentEventTypes.ForwardShopEvent}`;
    shopEvent: ShopEventUnion;
}

export interface AgentForwardShellEvent {
    type: `${AgentEventTypes.ForwardShellEvent}`;
    shellEvent: ShellEventUnion;
}

export interface AgentIntentOpenCartEvent {
    type: `${AgentEventTypes.IntentOpenCart}`;
}

export interface AgentIntentOpenAutoshipEvent {
    type: `${AgentEventTypes.IntentOpenAutoship}`;
}

export interface AgentIntentAddToyToCartEvent {
    type: `${AgentEventTypes.IntentAddToyToCart}`;
}

export interface AgentIntentAddDogFoodToCartEvent {
    type: `${AgentEventTypes.IntentAddDogFoodToCart}`;
}

export interface AgentIntentCleanCartEvent {
    type: `${AgentEventTypes.IntentCleanCart}`;
}

export interface AgentDecideAcceptEvent {
    type: `${AgentEventTypes.DecideAccept}`;
    eventId: string;
}

export interface AgentDecideAlwaysEvent {
    type: `${AgentEventTypes.DecideAlways}`;
    eventId: string;
}

export interface AgentDecideCancelEvent {
    type: `${AgentEventTypes.DecideCancel}`;
    eventId: string;
}

export interface AgentDecideNeverEvent {
    type: `${AgentEventTypes.DecideNever}`;
    eventId: string;
}

export interface AgentDispatchNextEvent {
    type: `${AgentEventTypes.DispatchNext}`;
}

export interface AgentEventDispatchedEvent {
    type: `${AgentEventTypes.EventDispatched}`;
    eventId: string;
}

export interface AgentEventBlockedEvent {
    type: `${AgentEventTypes.EventBlocked}`;
    eventId: string;
    message: string;
}

export interface AgentClearDebugTracesEvent {
    type: `${AgentEventTypes.ClearDebugTraces}`;
}

export interface AgentChatRequestSucceededEvent {
    status: number;
    ok: boolean;
    requestPayload: BuddyChatInput;
    parsed: BuddyChatOutput | null;
    rawText: string;
}

export type AgentEventUnion =
    | AgentBindBuddyProfileEvent
    | AgentChatRequestSubmittedEvent
    | AgentUserMessageReceivedEvent
    | AgentModelResponseReceivedEvent
    | AgentQueueEventsEvent
    | AgentForwardShopEvent
    | AgentForwardShellEvent
    | AgentIntentOpenCartEvent
    | AgentIntentOpenAutoshipEvent
    | AgentIntentAddToyToCartEvent
    | AgentIntentAddDogFoodToCartEvent
    | AgentIntentCleanCartEvent
    | AgentDecideAcceptEvent
    | AgentDecideAlwaysEvent
    | AgentDecideCancelEvent
    | AgentDecideNeverEvent
    | AgentDispatchNextEvent
    | AgentEventDispatchedEvent
    | AgentEventBlockedEvent
    | AgentClearDebugTracesEvent
    | ShopEventUnion
    | ShellEventUnion;
