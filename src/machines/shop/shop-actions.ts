import {
    addCustomList,
    addItem,
    removeCustomBucket,
    removeItem,
    saveBuckets,
    showBucket,
    updateItemQty,
} from '@/domain/storage';
import type { ShopContext } from './shop-context';
import {
    FeedbackActionKeys,
    FeedbackEventTypes,
    type ShellyFeedbackEvent,
} from '@specfocus/shelly/lib/machines/feedback';
import { ShopEventTypes } from './shop-event-types';
import shopSetup from './shop-setup';
import type {
    ShopAddItemEvent,
    ShopCreateCustomBucketEvent,
    ShopHydrateEvent,
    ShopSearchProductsEvent,
    ShopRemoveCustomBucketEvent,
    ShopRemoveItemEvent,
    ShopUpdateItemQtyEvent,
    ShopOpenBucketEvent,
    ShopToggleBucketOpenEvent,
    ShopToggleBucketShowEvent,
} from './shop-events';

const { assign } = shopSetup;

const shopActions = {
    [FeedbackActionKeys.RecordFeedback]: assign(({ event }) => ({
        lastFeedbackEvent: event as ShellyFeedbackEvent,
    })),

    setActiveViewFromFeedback: assign(({ context, event }) => {
        if (event.type !== FeedbackEventTypes.ActiveViewChanged) {
            return { activeViewId: context.activeViewId };
        }
        return {
            activeViewId: event.viewId,
        };
    }),

    setBreadcrumbsFromFeedback: assign(({ context, event }) => {
        if (event.type !== FeedbackEventTypes.BreadcrumbsChanged) {
            return { breadcrumbs: context.breadcrumbs };
        }
        return {
            breadcrumbs: event.items,
        };
    }),

    hydrate: assign(({ event }) => {
        const hydrateEvent = event as ShopHydrateEvent;
        return {
            buckets: hydrateEvent.buckets,
            dirty: false,
            lastError: null,
        };
    }),

    createCustomBucket: assign(({ context, event }) => {
        const createEvent = event as ShopCreateCustomBucketEvent;
        return {
            buckets: addCustomList(context.buckets, createEvent.name, createEvent.icon),
            dirty: true,
        };
    }),

    removeCustomBucket: assign(({ context, event }) => {
        const removeEvent = event as ShopRemoveCustomBucketEvent;
        return {
            buckets: removeCustomBucket(context.buckets, removeEvent.id),
            dirty: true,
        };
    }),

    addItemToBucket: assign(({ context, event }) => {
        const addItemEvent = event as ShopAddItemEvent;
        return {
            buckets: addItem(context.buckets, addItemEvent.bucketName, {
                sku: addItemEvent.sku,
                name: addItemEvent.name,
                qty: addItemEvent.qty,
                imageUrl: addItemEvent.imageUrl,
                price: addItemEvent.price,
            }),
            dirty: true,
        };
    }),

    updateBucketItemQty: assign(({ context, event }) => {
        const updateEvent = event as ShopUpdateItemQtyEvent;
        return {
            buckets: updateItemQty(context.buckets, updateEvent.bucketName, updateEvent.sku, updateEvent.qty),
            dirty: true,
        };
    }),

    removeBucketItem: assign(({ context, event }) => {
        const removeEvent = event as ShopRemoveItemEvent;
        return {
            buckets: removeItem(context.buckets, removeEvent.bucketName, removeEvent.sku),
            dirty: true,
        };
    }),

    openBucket: assign(({ context, event }) => {
        const { name } = event as ShopOpenBucketEvent;
        return {
            buckets: showBucket(context.buckets, name),
            dirty: true,
        };
    }),

    clearCart: assign(({ context }) => {
        const cart = context.buckets['cart'];
        if (!cart) return {};
        return {
            buckets: { ...context.buckets, ['cart']: { ...cart, items: [], updatedAt: new Date().toISOString() } },
            dirty: true,
        };
    }),

    toggleBucketOpen: assign(({ context, event }) => {
        const { name } = event as ShopToggleBucketOpenEvent;
        const bucket = context.buckets[name];
        if (!bucket) return {};
        return {
            buckets: { ...context.buckets, [name]: { ...bucket, open: !bucket.open } },
        };
    }),

    toggleBucketShow: assign(({ context, event }) => {
        const { name } = event as ShopToggleBucketShowEvent;
        const bucket = context.buckets[name];
        if (!bucket) return {};
        return {
            buckets: { ...context.buckets, [name]: { ...bucket, show: !bucket.show } },
        };
    }),

    toggleBuddyOpen: assign(({ context }) => ({
        buddyOpen: !context.buddyOpen,
    })),

    toggleBuddyShow: assign(({ context }) => ({
        buddyShow: !context.buddyShow,
    })),

    toggleDebugOpen: assign(({ context }) => ({
        debugOpen: !context.debugOpen,
    })),

    toggleDebugShow: assign(({ context }) => ({
        debugShow: !context.debugShow,
    })),

    searchProducts: assign(({ context, event }) => {
        const searchEvent = event as ShopSearchProductsEvent;
        return {
            // placeholder orchestration marker for now
            lastError: searchEvent.query ? null : context.lastError,
        };
    }),

    persistBuckets: ({ context }: { context: ShopContext; }) => {
        saveBuckets(context.buckets);
    },

    markPersisted: assign(() => ({
        dirty: false,
        lastError: null,
    })),

    setPersistError: assign(({ event }) => {
        if (event.type !== ShopEventTypes.PersistFailed) {
            return {};
        }
        return {
            lastError: event.message,
        };
    }),
};

export default shopActions;
