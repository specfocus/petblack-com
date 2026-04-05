import type { ShopList } from '@/dialogs/settings/sections/shop/domain/types';
import { loadLists } from '@/dialogs/settings/sections/shop/domain/storage';
import type { BreadcrumbItem } from '@specfocus/shelly/lib/shell/breadcrumbs';
import type { ShellyFeedbackEvent } from '@specfocus/shelly/lib/machines/feedback';

export interface ShopContext {
    lists: ShopList[];
    dirty: boolean;
    lastError: string | null;
    activeViewId: string | null;
    breadcrumbs: BreadcrumbItem[];
    lastFeedbackEvent: ShellyFeedbackEvent | null;
}

export interface CreateShopMachineParams {
    initialLists?: ShopList[];
}

export const createInitialShopContext = (input?: CreateShopMachineParams): ShopContext => ({
    lists: input?.initialLists ?? loadLists(),
    dirty: false,
    lastError: null,
    activeViewId: null,
    breadcrumbs: [],
    lastFeedbackEvent: null,
});
