import type { Actor, SnapshotFrom } from '@specfocus/atoms/lib/machine';
import agentSetup from './agent-setup';
import agentActions from './agent-actions';
import { AgentEventTypes } from './agent-event-types';
import AgentStates from './agent-states';
import { createInitialAgentContext } from './agent-context';

export const AGENT_MACHINE_PATH = ['petblack', 'machines', 'agent'] as const;
export const AGENT_SYSTEM_ID = AGENT_MACHINE_PATH.join('/');

const agentMachine = agentSetup.extend({ actions: agentActions }).createMachine({
    id: AGENT_SYSTEM_ID,
    initial: AgentStates.Ready,
    context: ({ input }) => createInitialAgentContext(input),
    states: {
        [AgentStates.Ready]: {
            on: {
                [AgentEventTypes.BindBuddyProfile]: {
                    actions: ['bindBuddyProfile'],
                },
                [AgentEventTypes.ChatRequestSubmitted]: {
                    target: AgentStates.ProcessingChat,
                    actions: ['markRequestStarted'],
                },
                [AgentEventTypes.UserMessageReceived]: {
                    actions: ['setLastUserMessage'],
                },
                [AgentEventTypes.ModelResponseReceived]: {
                    actions: ['setModelReplyAndQueue'],
                },
                [AgentEventTypes.QueueEvents]: {
                    actions: ['queueEvents'],
                },
                [AgentEventTypes.ForwardShopEvent]: {
                    actions: ['enqueueForwardShopEvent'],
                },
                [AgentEventTypes.ForwardShellEvent]: {
                    actions: ['enqueueForwardShellEvent'],
                },
                [AgentEventTypes.ConsumeForwardedShopEvent]: {
                    actions: ['consumeForwardedShopEvent'],
                },
                [AgentEventTypes.ConsumeForwardedShellEvent]: {
                    actions: ['consumeForwardedShellEvent'],
                },
                [AgentEventTypes.IntentOpenCart]: {
                    actions: ['translateIntentOpenCart'],
                },
                [AgentEventTypes.IntentOpenAutoship]: {
                    actions: ['translateIntentOpenAutoship'],
                },
                [AgentEventTypes.IntentAddToyToCart]: {
                    actions: ['translateIntentAddToyToCart'],
                },
                [AgentEventTypes.IntentAddDogFoodToCart]: {
                    actions: ['translateIntentAddDogFoodToCart'],
                },
                [AgentEventTypes.IntentCleanCart]: {
                    actions: ['translateIntentCleanCart'],
                },
                [AgentEventTypes.DecideAccept]: {
                    actions: ['removePendingEvent'],
                },
                [AgentEventTypes.DecideAlways]: {
                    actions: ['applyAlwaysDecision', 'removePendingEvent'],
                },
                [AgentEventTypes.DecideCancel]: {
                    actions: ['removePendingEvent'],
                },
                [AgentEventTypes.DecideNever]: {
                    actions: ['applyNeverDecision', 'removePendingEvent'],
                },
                [AgentEventTypes.EventDispatched]: {
                    actions: ['removePendingEvent'],
                },
                [AgentEventTypes.EventBlocked]: {
                    actions: ['setBlockedMessage', 'removePendingEvent'],
                },
                [AgentEventTypes.ClearDebugTraces]: {
                    actions: ['clearDebugTraces'],
                },
            },
        },
        [AgentStates.ProcessingChat]: {
            always: {
                guard: ({ context }) => context.pendingPayload === null,
                target: AgentStates.Ready,
            },
            invoke: {
                src: 'buddyChatRequest',
                input: ({ context }) => ({
                    type: AgentEventTypes.ChatRequestSubmitted,
                    payload: context.pendingPayload!,
                }),
                onDone: {
                    target: AgentStates.Ready,
                    actions: ['applyChatSuccess'],
                },
                onError: {
                    target: AgentStates.Ready,
                    actions: ['applyChatError'],
                },
            },
            on: {
                [AgentEventTypes.EventBlocked]: {
                    actions: ['setBlockedMessage', 'removePendingEvent'],
                },
            },
        },
    },
});

export type AgentMachine = typeof agentMachine;
export type AgentActor = Actor<AgentMachine>;
export type AgentSnapshot = SnapshotFrom<AgentMachine>;

export default agentMachine;
