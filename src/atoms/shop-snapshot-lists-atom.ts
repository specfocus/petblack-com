import atom from '@specfocus/atoms/lib/atom';
import shopSnapshotAtom from './shop-snapshot-atom';

const shopSnapshotListsAtom = atom((get) => get(shopSnapshotAtom).context.lists);

export default shopSnapshotListsAtom;
