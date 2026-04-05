import type { StorageResultEventUnion } from './storage-events';

export interface StorageContext {
    implementation: 'local-storage';
    lastRequestId: string | null;
    lastResult: StorageResultEventUnion | null;
    lastError: string | null;
}

export interface CreateStorageMachineParams {
    implementation?: 'local-storage';
}

export const createInitialStorageContext = (): StorageContext => ({
    implementation: 'local-storage',
    lastRequestId: null,
    lastResult: null,
    lastError: null,
});
