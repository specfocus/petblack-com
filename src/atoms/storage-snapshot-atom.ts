import type { WritableAtom } from '@specfocus/atoms/lib/atom';
import type { Getter } from '@specfocus/atoms/lib/atom';
import type { SnapshotFrom } from '@specfocus/atoms/lib/machine';
import { atomWithActorSnapshot } from '@specfocus/atoms/lib/machine';
import type { StorageMachine } from '@/machines/storage/storage-machine';
import storageActorAtom from './storage-actor-atom';

const storageSnapshotAtom: WritableAtom<SnapshotFrom<StorageMachine>, never[], void> = atomWithActorSnapshot(
    (get: Getter) => get(storageActorAtom)
) as WritableAtom<SnapshotFrom<StorageMachine>, never[], void>;

export default storageSnapshotAtom;
