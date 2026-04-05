export enum AgentEventTypes {
    UserMessageReceived = 'agent.userMessageReceived',
    ModelResponseReceived = 'agent.modelResponseReceived',
    QueueEvents = 'agent.queueEvents',
    DecideAccept = 'agent.decideAccept',
    DecideAlways = 'agent.decideAlways',
    DecideCancel = 'agent.decideCancel',
    DecideNever = 'agent.decideNever',
    DispatchNext = 'agent.dispatchNext',
    EventDispatched = 'agent.eventDispatched',
    EventBlocked = 'agent.eventBlocked',
}

export type AgentEventType = `${AgentEventTypes}`;
