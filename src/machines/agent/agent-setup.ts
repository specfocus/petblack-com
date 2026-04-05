import { fromPromise, setup } from '@specfocus/atoms/lib/machine';
import { parseBuddyModelResponse } from '@/widgets/buddy/server/responseSchema';
import type { AgentContext, CreateAgentMachineParams } from './agent-context';
import type {
    AgentChatRequestSucceededEvent,
    AgentChatRequestSubmittedEvent,
    AgentEventUnion,
} from './agent-events';

const agentSetup = setup({
    types: {
        context: {} as AgentContext,
        events: {} as AgentEventUnion,
        input: {} as CreateAgentMachineParams,
    },
    actors: {
        buddyChatRequest: fromPromise<AgentChatRequestSucceededEvent, AgentChatRequestSubmittedEvent>(
            async ({ input }) => {
                const response = await fetch('/api/buddy/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input.payload),
                });
                const rawText = await response.text();
                const parsed = parseBuddyModelResponse(rawText);
                return {
                    status: response.status,
                    ok: response.ok,
                    requestPayload: input.payload,
                    parsed: parsed ? { ...parsed, source: response.ok ? 'gemini' : 'fallback' } : null,
                    rawText,
                };
            }
        ),
    },
    guards: {
        hasPendingPayload: ({ context }) => context.pendingPayload !== null,
    },
});

export type AgentSetup = typeof agentSetup;

export default agentSetup;
