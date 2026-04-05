import { setup } from '@specfocus/atoms/lib/machine';
import localStorageMachine from '../local-storage/local-storage-machine';
import type { StorageContext, CreateStorageMachineParams } from './storage-context';
import type { StorageEventUnion } from './storage-events';

const storageSetup = setup({
    types: {
        context: {} as StorageContext,
        events: {} as StorageEventUnion,
        input: {} as CreateStorageMachineParams,
    },
    actors: {
        localStorageMachine,
    },
});

export type StorageSetup = typeof storageSetup;

export default storageSetup;
