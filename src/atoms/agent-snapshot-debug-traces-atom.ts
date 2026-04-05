import atom from '@specfocus/atoms/lib/atom';
import agentSnapshotAtom from './agent-snapshot-atom';

const agentSnapshotDebugTracesAtom = atom((get) => get(agentSnapshotAtom).context.debugTraces);

export default agentSnapshotDebugTracesAtom;
