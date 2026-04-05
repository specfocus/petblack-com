import type { AgentEventTypes } from './agent-event-types';

export interface AgentEventEnvelope {
    id: string;
    target: 'shop';
    eventType: string;
    payload?: Record<string, unknown>;
    reason?: string;
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

export type AgentEventUnion =
    | AgentUserMessageReceivedEvent
    | AgentModelResponseReceivedEvent
    | AgentQueueEventsEvent
    | AgentDecideAcceptEvent
    | AgentDecideAlwaysEvent
    | AgentDecideCancelEvent
    | AgentDecideNeverEvent
    | AgentDispatchNextEvent
    | AgentEventDispatchedEvent
    | AgentEventBlockedEvent;
