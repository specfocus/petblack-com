import atom from '@specfocus/atoms/lib/atom';
import storageSnapshotAtom from './storage-snapshot-atom';

const storageSnapshotLastResultAtom = atom((get) =>
    get(storageSnapshotAtom).context.lastResult
);

export default storageSnapshotLastResultAtom;
