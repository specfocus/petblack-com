export interface LocalStorageContext {
    activeNamespace: string | null;
}

export interface CreateLocalStorageMachineParams {
    initialNamespace?: string;
}

export const createInitialLocalStorageContext = (): LocalStorageContext => ({
    activeNamespace: null,
});
