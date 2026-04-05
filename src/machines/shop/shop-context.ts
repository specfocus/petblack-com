import type { Bucket } from '@/dialogs/settings/sections/shop/domain/types';
import { loadBuckets } from '@/dialogs/settings/sections/shop/domain/storage';
import type { BreadcrumbItem } from '@specfocus/shelly/lib/shell/breadcrumbs';
import type { ShellyFeedbackEvent } from '@specfocus/shelly/lib/machines/feedback';

export interface ShopContext {
    buckets: Record<string, Bucket>;
    buddyOpen?: boolean;
    buddyShow?: boolean;
    debugOpen?: boolean;
    debugShow?: boolean;
    dirty: boolean;
    lastError: string | null;
    activeViewId: string | null;
    breadcrumbs: BreadcrumbItem[];
    lastFeedbackEvent: ShellyFeedbackEvent | null;
}

export interface CreateShopMachineParams {
    initialLists?: Bucket[];
}

export const createInitialShopContext = (input?: CreateShopMachineParams): ShopContext => ({
    buckets: input?.initialLists ?? loadBuckets(),
    dirty: false,
    lastError: null,
    activeViewId: null,
    breadcrumbs: [],
    lastFeedbackEvent: null,
});
