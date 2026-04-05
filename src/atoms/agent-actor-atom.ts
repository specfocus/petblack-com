import type { WritableAtom } from '@specfocus/atoms/lib/atom';
import type { Getter } from '@specfocus/atoms/lib/atom';
import { atomWithActor, type RESTART } from '@specfocus/atoms/lib/machine';
import agentMachine, { AGENT_SYSTEM_ID } from '@/machines/agent/agent-machine';
import type { AgentActor } from '@/machines/agent/agent-machine';
import type { AgentEventUnion } from '@/machines/agent/agent-events';

const agentActorAtom: WritableAtom<AgentActor, [AgentEventUnion | typeof RESTART], void> = atomWithActor(
    () => agentMachine,
    (_get: Getter) => ({
        systemId: AGENT_SYSTEM_ID,
        input: {},
    })
) as WritableAtom<AgentActor, [AgentEventUnion | typeof RESTART], void>;

export default agentActorAtom;
