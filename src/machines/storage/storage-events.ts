import type { StorageEventTypes } from './storage-event-types';

export interface StorageLoadEvent {
    type: `${StorageEventTypes.Load}`;
    requestId: string;
    namespace: string;
    key: string;
}

export interface StorageSaveEvent {
    type: `${StorageEventTypes.Save}`;
    requestId: string;
    namespace: string;
    key: string;
    value: unknown;
}

export interface StorageRemoveEvent {
    type: `${StorageEventTypes.Remove}`;
    requestId: string;
    namespace: string;
    key: string;
}

export interface StorageListKeysEvent {
    type: `${StorageEventTypes.Buckets}`;
    requestId: string;
    namespace: string;
}

export interface StorageClearNamespaceEvent {
    type: `${StorageEventTypes.ClearNamespace}`;
    requestId: string;
    namespace: string;
}

export interface StorageLoadedEvent {
    type: `${StorageEventTypes.Loaded}`;
    requestId: string;
    namespace: string;
    key: string;
    value: unknown;
}

export interface StorageSavedEvent {
    type: `${StorageEventTypes.Saved}`;
    requestId: string;
    namespace: string;
    key: string;
}

export interface StorageRemovedEvent {
    type: `${StorageEventTypes.Removed}`;
    requestId: string;
    namespace: string;
    key: string;
}

export interface StorageListedKeysEvent {
    type: `${StorageEventTypes.BucketedKeys}`;
    requestId: string;
    namespace: string;
    keys: string[];
}

export interface StorageClearedNamespaceEvent {
    type: `${StorageEventTypes.ClearedNamespace}`;
    requestId: string;
    namespace: string;
}

export interface StorageFailedEvent {
    type: `${StorageEventTypes.Failed}`;
    requestId: string;
    operation: string;
    message: string;
}

export type StorageRequestEventUnion =
    | StorageLoadEvent
    | StorageSaveEvent
    | StorageRemoveEvent
    | StorageListKeysEvent
    | StorageClearNamespaceEvent;

export type StorageResultEventUnion =
    | StorageLoadedEvent
    | StorageSavedEvent
    | StorageRemovedEvent
    | StorageListedKeysEvent
    | StorageClearedNamespaceEvent
    | StorageFailedEvent;

export type StorageEventUnion = StorageRequestEventUnion | StorageResultEventUnion;
