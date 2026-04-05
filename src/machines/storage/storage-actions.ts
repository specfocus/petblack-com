import storageSetup from './storage-setup';
import { StorageEventTypes } from './storage-event-types';
import type { StorageResultEventUnion } from './storage-events';

const { assign } = storageSetup;

const storageActions = {
    setLastRequest: assign(({ event }) => ({
        lastRequestId: 'requestId' in event ? event.requestId : null,
    })),

    recordStorageResult: assign(({ event }) => {
        if (
            event.type !== StorageEventTypes.Loaded &&
            event.type !== StorageEventTypes.Saved &&
            event.type !== StorageEventTypes.Removed &&
            event.type !== StorageEventTypes.ListedKeys &&
            event.type !== StorageEventTypes.ClearedNamespace &&
            event.type !== StorageEventTypes.Failed
        ) return {};

        const resultEvent = event as StorageResultEventUnion;
        return {
            lastResult: resultEvent,
            lastError: resultEvent.type === StorageEventTypes.Failed ? resultEvent.message : null,
        };
    }),
};

export default storageActions;
