import { setup } from '@specfocus/atoms/lib/machine';
import type { AgentContext, CreateAgentMachineParams } from './agent-context';
import type { AgentEventUnion } from './agent-events';

const agentSetup = setup({
    types: {
        context: {} as AgentContext,
        events: {} as AgentEventUnion,
        input: {} as CreateAgentMachineParams,
    },
});

export type AgentSetup = typeof agentSetup;

export default agentSetup;
