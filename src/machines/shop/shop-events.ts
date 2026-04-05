import type { StorageEventTypes } from '../storage/storage-event-types';
import type { Bucket } from '@/domain/types';
import type { ShellyFeedbackEvent } from '@specfocus/shelly/lib/machines/feedback';
import type { ShopEventTypes } from './shop-event-types';

export interface ShopBootstrapEvent {
    type: `${ShopEventTypes.Bootstrap}`;
}

export interface ShopHydrateEvent {
    type: `${ShopEventTypes.Hydrate}`;
    buckets: Record<string, Bucket>;
}

export interface ShopOpenBucketEvent {
    type: `${ShopEventTypes.OpenBucket}`;
    name: string;
}

export interface ShopSearchProductsEvent {
    type: `${ShopEventTypes.SearchProducts}`;
    query: string;
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
    bucketName: string;
    sku: string;
    name: string;
    qty: number;
}

export interface ShopUpdateItemQtyEvent {
    type: `${ShopEventTypes.UpdateItemQty}`;
    bucketName: string;
    sku: string;
    qty: number;
}

export interface ShopRemoveItemEvent {
    type: `${ShopEventTypes.RemoveItem}`;
    bucketName: string;
    sku: string;
}

export interface ShopClearCartEvent {
    type: `${ShopEventTypes.ClearCart}`;
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

export interface ShopToggleBucketOpenEvent {
    type: `${ShopEventTypes.ToggleBucketOpen}`;
    name: string;
}

export interface ShopToggleBucketShowEvent {
    type: `${ShopEventTypes.ToggleBucketShow}`;
    name: string;
}

export interface ShopToggleBuddyOpenEvent {
    type: `${ShopEventTypes.ToggleBuddyOpen}`;
}

export interface ShopToggleBuddyShowEvent {
    type: `${ShopEventTypes.ToggleBuddyShow}`;
}

export interface ShopToggleDebugOpenEvent {
    type: `${ShopEventTypes.ToggleDebugOpen}`;
}

export interface ShopToggleDebugShowEvent {
    type: `${ShopEventTypes.ToggleDebugShow}`;
}

export type ShopEventUnion =
    | ShopBootstrapEvent
    | ShopHydrateEvent
    | ShopOpenBucketEvent
    | ShopSearchProductsEvent
    | ShopCreateCustomListEvent
    | ShopRemoveCustomListEvent
    | ShopAddItemEvent
    | ShopUpdateItemQtyEvent
    | ShopRemoveItemEvent
    | ShopClearCartEvent
    | ShopPersistRequestedEvent
    | ShopPersistSucceededEvent
    | ShopPersistFailedEvent
    | ShopStorageLoadedEvent
    | ShellyFeedbackEvent
    | ShopToggleBucketOpenEvent
    | ShopToggleBucketShowEvent
    | ShopToggleBuddyOpenEvent
    | ShopToggleBuddyShowEvent
    | ShopToggleDebugOpenEvent
    | ShopToggleDebugShowEvent;
