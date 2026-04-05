import atom from '@specfocus/atoms/lib/atom';
import shopSnapshotAtom from './shop-snapshot-atom';

const shopSnapshotStateValueAtom = atom((get) => String(get(shopSnapshotAtom).value));

export default shopSnapshotStateValueAtom;
