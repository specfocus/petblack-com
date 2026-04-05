export enum StorageEventTypes {
    Load = 'storage.load',
    Save = 'storage.save',
    Remove = 'storage.remove',
    ListKeys = 'storage.listKeys',
    ClearNamespace = 'storage.clearNamespace',
    Loaded = 'storage.loaded',
    Saved = 'storage.saved',
    Removed = 'storage.removed',
    ListedKeys = 'storage.listedKeys',
    ClearedNamespace = 'storage.clearedNamespace',
    Failed = 'storage.failed',
}

export type StorageEventType = `${StorageEventTypes}`;
