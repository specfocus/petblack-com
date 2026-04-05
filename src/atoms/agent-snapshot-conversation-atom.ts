import atom from '@specfocus/atoms/lib/atom';
import agentSnapshotAtom from './agent-snapshot-atom';

const agentSnapshotConversationAtom = atom((get) => get(agentSnapshotAtom).context.conversation);

export default agentSnapshotConversationAtom;
