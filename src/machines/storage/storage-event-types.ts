export enum StorageEventTypes {
    Load = 'storage.load',
    Save = 'storage.save',
    Remove = 'storage.remove',
    Buckets = 'storage.buckets',
    ClearNamespace = 'storage.clearNamespace',
    Loaded = 'storage.loaded',
    Saved = 'storage.saved',
    Removed = 'storage.removed',
    BucketedKeys = 'storage.bucketedKeys',
    ClearedNamespace = 'storage.clearedNamespace',
    Failed = 'storage.failed',
}

export type StorageEventType = `${StorageEventTypes}`;
