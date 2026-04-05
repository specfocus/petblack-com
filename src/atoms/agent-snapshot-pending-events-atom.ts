import atom from '@specfocus/atoms/lib/atom';
import agentSnapshotAtom from './agent-snapshot-atom';

const agentSnapshotPendingEventsAtom = atom((get) =>
    get(agentSnapshotAtom).context.pendingEvents
);

export default agentSnapshotPendingEventsAtom;
