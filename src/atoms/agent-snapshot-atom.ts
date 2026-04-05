import type { WritableAtom } from '@specfocus/atoms/lib/atom';
import type { Getter } from '@specfocus/atoms/lib/atom';
import type { SnapshotFrom } from '@specfocus/atoms/lib/machine';
import { atomWithActorSnapshot } from '@specfocus/atoms/lib/machine';
import type { AgentMachine } from '@/machines/agent/agent-machine';
import agentActorAtom from './agent-actor-atom';

const agentSnapshotAtom: WritableAtom<SnapshotFrom<AgentMachine>, never[], void> = atomWithActorSnapshot(
    (get: Getter) => get(agentActorAtom)
) as WritableAtom<SnapshotFrom<AgentMachine>, never[], void>;

export default agentSnapshotAtom;
