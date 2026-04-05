import atom from '@specfocus/atoms/lib/atom';
import agentSnapshotAtom from './agent-snapshot-atom';

const agentSnapshotIsSendingAtom = atom((get) => get(agentSnapshotAtom).context.isSending);

export default agentSnapshotIsSendingAtom;
