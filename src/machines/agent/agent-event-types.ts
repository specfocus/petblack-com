export enum AgentEventTypes {
    BindBuddyProfile = 'agent.bindBuddyProfile',
    ChatRequestSubmitted = 'agent.chatRequestSubmitted',
    ForwardShopEvent = 'agent.forwardShopEvent',
    ForwardShellEvent = 'agent.forwardShellEvent',
    IntentOpenCart = 'agent.intent.openCart',
    IntentOpenAutoship = 'agent.intent.openAutoship',
    IntentAddToyToCart = 'agent.intent.addToyToCart',
    IntentAddDogFoodToCart = 'agent.intent.addDogFoodToCart',
    IntentCleanCart = 'agent.intent.cleanCart',
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
    ClearDebugTraces = 'agent.clearDebugTraces',
}

export type AgentEventType = `${AgentEventTypes}`;
