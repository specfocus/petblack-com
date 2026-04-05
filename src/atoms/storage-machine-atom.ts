import atom, { type Atom } from '@specfocus/atoms/lib/atom';
import storageMachine from '@/machines/storage/storage-machine';
import type { StorageMachine } from '@/machines/storage/storage-machine';

const storageMachineAtom: Atom<StorageMachine> = atom<StorageMachine>(storageMachine);

export default storageMachineAtom;
