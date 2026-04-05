import type { WritableAtom } from '@specfocus/atoms/lib/atom';
import type { Getter } from '@specfocus/atoms/lib/atom';
import { atomWithActor, type RESTART } from '@specfocus/atoms/lib/machine';
import storageMachine, { STORAGE_SYSTEM_ID } from '@/machines/storage/storage-machine';
import type { StorageActor } from '@/machines/storage/storage-machine';
import type { StorageEventUnion } from '@/machines/storage/storage-events';

const storageActorAtom: WritableAtom<StorageActor, [StorageEventUnion | typeof RESTART], void> = atomWithActor(
    () => storageMachine,
    (_get: Getter) => ({
        systemId: STORAGE_SYSTEM_ID,
        input: {
            implementation: 'local-storage',
        },
    })
) as WritableAtom<StorageActor, [StorageEventUnion | typeof RESTART], void>;

export default storageActorAtom;
