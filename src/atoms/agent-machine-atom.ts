import atom, { type Atom } from '@specfocus/atoms/lib/atom';
import agentMachine from '@/machines/agent/agent-machine';
import type { AgentMachine } from '@/machines/agent/agent-machine';

const agentMachineAtom: Atom<AgentMachine> = atom<AgentMachine>(agentMachine);

export default agentMachineAtom;
