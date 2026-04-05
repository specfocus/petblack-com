import type { StorageEventTypes } from '../storage/storage-event-types';
import type { ShopList } from '@/dialogs/settings/sections/shop/domain/types';
import type { ShopEventTypes } from './shop-event-types';

export interface ShopBootstrapEvent {
    type: `${ShopEventTypes.Bootstrap}`;
}

export interface ShopHydrateEvent {
    type: `${ShopEventTypes.Hydrate}`;
    lists: ShopList[];
}

export interface ShopToggleListEnabledEvent {
    type: `${ShopEventTypes.ToggleListEnabled}`;
    id: string;
    enabled: boolean;
}

export interface ShopCreateCustomListEvent {
    type: `${ShopEventTypes.CreateCustomList}`;
    name: string;
    icon: string;
}

export interface ShopRemoveCustomListEvent {
    type: `${ShopEventTypes.RemoveCustomList}`;
    id: string;
}

export interface ShopAddItemEvent {
    type: `${ShopEventTypes.AddItem}`;
    listId: string;
    sku: string;
    name: string;
    qty: number;
}

export interface ShopUpdateItemQtyEvent {
    type: `${ShopEventTypes.UpdateItemQty}`;
    listId: string;
    sku: string;
    qty: number;
}

export interface ShopRemoveItemEvent {
    type: `${ShopEventTypes.RemoveItem}`;
    listId: string;
    sku: string;
}

export interface ShopPersistRequestedEvent {
    type: `${ShopEventTypes.PersistRequested}`;
}

export interface ShopPersistSucceededEvent {
    type: `${ShopEventTypes.PersistSucceeded}`;
}

export interface ShopPersistFailedEvent {
    type: `${ShopEventTypes.PersistFailed}`;
    message: string;
}

export interface ShopStorageLoadedEvent {
    type: `${StorageEventTypes.Loaded}`;
    requestId: string;
    namespace: string;
    key: string;
    value: unknown;
}

export type ShopEventUnion =
    | ShopBootstrapEvent
    | ShopHydrateEvent
    | ShopToggleListEnabledEvent
    | ShopCreateCustomListEvent
    | ShopRemoveCustomListEvent
    | ShopAddItemEvent
    | ShopUpdateItemQtyEvent
    | ShopRemoveItemEvent
    | ShopPersistRequestedEvent
    | ShopPersistSucceededEvent
    | ShopPersistFailedEvent
    | ShopStorageLoadedEvent;
