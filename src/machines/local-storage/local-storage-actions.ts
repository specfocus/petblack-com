import { sendParent } from '@specfocus/atoms/lib/machine';
import { StorageEventTypes } from '../storage/storage-event-types';
import type {
    StorageClearNamespaceEvent,
    StorageListKeysEvent,
    StorageLoadEvent,
    StorageRemoveEvent,
    StorageSaveEvent,
} from '../storage/storage-events';

const toStorageKey = (namespace: string, key: string): string => `${namespace}:${key}`;

const canUseLocalStorage = (): boolean =>
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const parseMaybeJson = (value: string): unknown => {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const localStorageActions = {
    handleLoad: sendParent(({ event }) => {
        const loadEvent = event as StorageLoadEvent;
        if (!canUseLocalStorage()) {
            return {
                type: StorageEventTypes.Failed,
                requestId: loadEvent.requestId,
                operation: StorageEventTypes.Load,
                message: 'localStorage unavailable on this runtime',
            };
        }
        try {
            const raw = window.localStorage.getItem(toStorageKey(loadEvent.namespace, loadEvent.key));
            return {
                type: StorageEventTypes.Loaded,
                requestId: loadEvent.requestId,
                namespace: loadEvent.namespace,
                key: loadEvent.key,
                value: raw === null ? null : parseMaybeJson(raw),
            };
        } catch (error) {
            return {
                type: StorageEventTypes.Failed,
                requestId: loadEvent.requestId,
                operation: StorageEventTypes.Load,
                message: error instanceof Error ? error.message : 'Failed to load from localStorage',
            };
        }
    }),

    handleSave: sendParent(({ event }) => {
        const saveEvent = event as StorageSaveEvent;
        if (!canUseLocalStorage()) {
            return {
                type: StorageEventTypes.Failed,
                requestId: saveEvent.requestId,
                operation: StorageEventTypes.Save,
                message: 'localStorage unavailable on this runtime',
            };
        }
        try {
            window.localStorage.setItem(
                toStorageKey(saveEvent.namespace, saveEvent.key),
                JSON.stringify(saveEvent.value)
            );
            return {
                type: StorageEventTypes.Saved,
                requestId: saveEvent.requestId,
                namespace: saveEvent.namespace,
                key: saveEvent.key,
            };
        } catch (error) {
            return {
                type: StorageEventTypes.Failed,
                requestId: saveEvent.requestId,
                operation: StorageEventTypes.Save,
                message: error instanceof Error ? error.message : 'Failed to save to localStorage',
            };
        }
    }),

    handleRemove: sendParent(({ event }) => {
        const removeEvent = event as StorageRemoveEvent;
        if (!canUseLocalStorage()) {
            return {
                type: StorageEventTypes.Failed,
                requestId: removeEvent.requestId,
                operation: StorageEventTypes.Remove,
                message: 'localStorage unavailable on this runtime',
            };
        }
        try {
            window.localStorage.removeItem(toStorageKey(removeEvent.namespace, removeEvent.key));
            return {
                type: StorageEventTypes.Removed,
                requestId: removeEvent.requestId,
                namespace: removeEvent.namespace,
                key: removeEvent.key,
            };
        } catch (error) {
            return {
                type: StorageEventTypes.Failed,
                requestId: removeEvent.requestId,
                operation: StorageEventTypes.Remove,
                message: error instanceof Error ? error.message : 'Failed to remove from localStorage',
            };
        }
    }),

    handleListKeys: sendParent(({ event }) => {
        const bucketKeysEvent = event as StorageListKeysEvent;
        if (!canUseLocalStorage()) {
            return {
                type: StorageEventTypes.Failed,
                requestId: bucketKeysEvent.requestId,
                operation: StorageEventTypes.Buckets,
                message: 'localStorage unavailable on this runtime',
            };
        }
        try {
            const prefix = `${bucketKeysEvent.namespace}:`;
            const keys: string[] = [];
            for (let index = 0;index < window.localStorage.length;index += 1) {
                const itemKey = window.localStorage.key(index);
                if (itemKey?.startsWith(prefix)) {
                    keys.push(itemKey.slice(prefix.length));
                }
            }
            return {
                type: StorageEventTypes.BucketedKeys,
                requestId: bucketKeysEvent.requestId,
                namespace: bucketKeysEvent.namespace,
                keys,
            };
        } catch (error) {
            return {
                type: StorageEventTypes.Failed,
                requestId: bucketKeysEvent.requestId,
                operation: StorageEventTypes.Buckets,
                message: error instanceof Error ? error.message : 'Failed to bucket keys',
            };
        }
    }),

    handleClearNamespace: sendParent(({ event }) => {
        const clearNamespaceEvent = event as StorageClearNamespaceEvent;
        if (!canUseLocalStorage()) {
            return {
                type: StorageEventTypes.Failed,
                requestId: clearNamespaceEvent.requestId,
                operation: StorageEventTypes.ClearNamespace,
                message: 'localStorage unavailable on this runtime',
            };
        }
        try {
            const prefix = `${clearNamespaceEvent.namespace}:`;
            const keysToRemove: string[] = [];
            for (let index = 0;index < window.localStorage.length;index += 1) {
                const itemKey = window.localStorage.key(index);
                if (itemKey?.startsWith(prefix)) {
                    keysToRemove.push(itemKey);
                }
            }
            for (const key of keysToRemove) {
                window.localStorage.removeItem(key);
            }
            return {
                type: StorageEventTypes.ClearedNamespace,
                requestId: clearNamespaceEvent.requestId,
                namespace: clearNamespaceEvent.namespace,
            };
        } catch (error) {
            return {
                type: StorageEventTypes.Failed,
                requestId: clearNamespaceEvent.requestId,
                operation: StorageEventTypes.ClearNamespace,
                message: error instanceof Error ? error.message : 'Failed to clear namespace',
            };
        }
    }),
};

export default localStorageActions;
