import type { ShopList } from '@/dialogs/settings/sections/shop/domain/types';
import { loadLists } from '@/dialogs/settings/sections/shop/domain/storage';

export interface ShopContext {
    lists: ShopList[];
    dirty: boolean;
    lastError: string | null;
}

export interface CreateShopMachineParams {
    initialLists?: ShopList[];
}

export const createInitialShopContext = (input?: CreateShopMachineParams): ShopContext => ({
    lists: input?.initialLists ?? loadLists(),
    dirty: false,
    lastError: null,
});
