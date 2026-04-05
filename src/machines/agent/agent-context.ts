import type { BuddyProfile } from '@/widgets/buddy/domain/types';
import type { BuddyChatInput } from '@/widgets/buddy/domain/types';
import type {
    AgentConversationMessage,
    AgentDebugTrace,
    AgentEventEnvelope,
} from './agent-events';
import type { ShopEventUnion } from '../shop/shop-events';
import type { ShellEventUnion } from '@specfocus/shelly/lib/shell/machine/shell-events';

export interface AgentContext {
    lastUserMessage: string | null;
    lastReply: string | null;
    pendingEvents: AgentEventEnvelope[];
    conversation: AgentConversationMessage[];
    debugTraces: AgentDebugTrace[];
    isSending: boolean;
    buddyProfile: BuddyProfile | null;
    allowlist: string[];
    denylist: string[];
    lastBlockedMessage: string | null;
    pendingPayloadJson: string | null;
    pendingPayload: BuddyChatInput | null;
    forwardedShopEvents: ShopEventUnion[];
    forwardedShellEvents: ShellEventUnion[];
}

export interface CreateAgentMachineParams {
    allowlist?: string[];
    denylist?: string[];
}

export const createInitialAgentContext = (input?: CreateAgentMachineParams): AgentContext => ({
    lastUserMessage: null,
    lastReply: null,
    pendingEvents: [],
    conversation: [],
    debugTraces: [],
    isSending: false,
    buddyProfile: null,
    allowlist: input?.allowlist ?? [],
    denylist: input?.denylist ?? [],
    lastBlockedMessage: null,
    pendingPayloadJson: null,
    pendingPayload: null,
    forwardedShopEvents: [],
    forwardedShellEvents: [],
});
