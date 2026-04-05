import atom from '@specfocus/atoms/lib/atom';
import shopSnapshotAtom from './shop-snapshot-atom';

const shopSnapshotBucketsAtom = atom((get) => get(shopSnapshotAtom).context.buckets);

export default shopSnapshotBucketsAtom;
