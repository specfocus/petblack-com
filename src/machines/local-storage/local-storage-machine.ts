import type { SnapshotFrom } from '@specfocus/atoms/lib/machine';
import LocalStorageStates from './local-storage-states';
import localStorageSetup from './local-storage-setup';
import localStorageActions from './local-storage-actions';
import { createInitialLocalStorageContext } from './local-storage-context';
import { StorageEventTypes } from '../storage/storage-event-types';

export const LOCAL_STORAGE_MACHINE_PATH = ['petblack', 'machines', 'local-storage'] as const;
export const LOCAL_STORAGE_SYSTEM_ID = LOCAL_STORAGE_MACHINE_PATH.join('/');

const localStorageMachine = localStorageSetup.createMachine({
    id: LOCAL_STORAGE_SYSTEM_ID,
    initial: LocalStorageStates.Idle,
    context: ({ input }) => ({
        ...createInitialLocalStorageContext(),
        activeNamespace: input.initialNamespace ?? null,
    }),
    states: {
        [LocalStorageStates.Idle]: {
            on: {
                [StorageEventTypes.Load]: {
                    actions: [localStorageActions.handleLoad as any],
                },
                [StorageEventTypes.Save]: {
                    actions: [localStorageActions.handleSave as any],
                },
                [StorageEventTypes.Remove]: {
                    actions: [localStorageActions.handleRemove as any],
                },
                [StorageEventTypes.Buckets]: {
                    actions: [localStorageActions.handleListKeys as any],
                },
                [StorageEventTypes.ClearNamespace]: {
                    actions: [localStorageActions.handleClearNamespace as any],
                },
            },
        },
    },
});

export type LocalStorageMachine = typeof localStorageMachine;
export type LocalStorageSnapshot = SnapshotFrom<LocalStorageMachine>;

export default localStorageMachine;
