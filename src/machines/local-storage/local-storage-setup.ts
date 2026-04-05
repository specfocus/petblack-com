import { setup } from '@specfocus/atoms/lib/machine';
import type {
    LocalStorageContext,
    CreateLocalStorageMachineParams,
} from './local-storage-context';
import type { LocalStorageEventUnion } from './local-storage-events';

const localStorageSetup = setup({
    types: {
        context: {} as LocalStorageContext,
        events: {} as LocalStorageEventUnion,
        input: {} as CreateLocalStorageMachineParams,
    },
});

export type LocalStorageSetup = typeof localStorageSetup;

export default localStorageSetup;
