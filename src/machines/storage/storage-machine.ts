import type { Actor, SnapshotFrom } from '@specfocus/atoms/lib/machine';
import StorageStates from './storage-states';
import storageSetup from './storage-setup';
import storageActions from './storage-actions';
import { createInitialStorageContext } from './storage-context';
import { StorageEventTypes } from './storage-event-types';

export const STORAGE_MACHINE_PATH = ['petblack', 'machines', 'storage'] as const;
export const STORAGE_SYSTEM_ID = STORAGE_MACHINE_PATH.join('/');

const storageMachine = storageSetup.extend({ actions: storageActions }).createMachine({
    id: STORAGE_SYSTEM_ID,
    initial: StorageStates.Idle,
    context: ({ input }) => ({
        ...createInitialStorageContext(),
        implementation: input.implementation ?? 'local-storage',
    }),
    states: {
        [StorageStates.Idle]: {
            on: {
                [StorageEventTypes.Load]: {
                    actions: ['setLastRequest'],
                },
                [StorageEventTypes.Save]: {
                    actions: ['setLastRequest'],
                },
                [StorageEventTypes.Remove]: {
                    actions: ['setLastRequest'],
                },
                [StorageEventTypes.ListKeys]: {
                    actions: ['setLastRequest'],
                },
                [StorageEventTypes.ClearNamespace]: {
                    actions: ['setLastRequest'],
                },
                [StorageEventTypes.Loaded]: {
                    actions: ['recordStorageResult'],
                },
                [StorageEventTypes.Saved]: {
                    actions: ['recordStorageResult'],
                },
                [StorageEventTypes.Removed]: {
                    actions: ['recordStorageResult'],
                },
                [StorageEventTypes.ListedKeys]: {
                    actions: ['recordStorageResult'],
                },
                [StorageEventTypes.ClearedNamespace]: {
                    actions: ['recordStorageResult'],
                },
                [StorageEventTypes.Failed]: {
                    actions: ['recordStorageResult'],
                },
            },
        },
    },
});

export type StorageMachine = typeof storageMachine;
export type StorageActor = Actor<StorageMachine>;
export type StorageSnapshot = SnapshotFrom<StorageMachine>;

export default storageMachine;
