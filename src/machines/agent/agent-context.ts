import type { AgentEventEnvelope } from './agent-events';

export interface AgentContext {
    lastUserMessage: string | null;
    lastReply: string | null;
    pendingEvents: AgentEventEnvelope[];
    allowlist: string[];
    denylist: string[];
    lastBlockedMessage: string | null;
}

export interface CreateAgentMachineParams {
    allowlist?: string[];
    denylist?: string[];
}

export const createInitialAgentContext = (input?: CreateAgentMachineParams): AgentContext => ({
    lastUserMessage: null,
    lastReply: null,
    pendingEvents: [],
    allowlist: input?.allowlist ?? [],
    denylist: input?.denylist ?? [],
    lastBlockedMessage: null,
});
