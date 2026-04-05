import {
    addCustomList,
    addItem,
    removeCustomList,
    removeItem,
    saveLists,
    setListEnabled,
    updateItemQty,
} from '@/dialogs/settings/sections/shop/domain/storage';
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
    ShopCreateCustomListEvent,
    ShopHydrateEvent,
    ShopSearchProductsEvent,
    ShopRemoveCustomListEvent,
    ShopRemoveItemEvent,
    ShopToggleListEnabledEvent,
    ShopUpdateItemQtyEvent,
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
            lists: hydrateEvent.lists,
            dirty: false,
            lastError: null,
        };
    }),

    toggleListEnabled: assign(({ context, event }) => {
        const toggleEvent = event as ShopToggleListEnabledEvent;
        return {
            lists: setListEnabled(context.lists, toggleEvent.id, toggleEvent.enabled),
            dirty: true,
        };
    }),

    createCustomList: assign(({ context, event }) => {
        const createEvent = event as ShopCreateCustomListEvent;
        return {
            lists: addCustomList(context.lists, createEvent.name, createEvent.icon),
            dirty: true,
        };
    }),

    removeCustomList: assign(({ context, event }) => {
        const removeEvent = event as ShopRemoveCustomListEvent;
        return {
            lists: removeCustomList(context.lists, removeEvent.id),
            dirty: true,
        };
    }),

    addItemToList: assign(({ context, event }) => {
        const addItemEvent = event as ShopAddItemEvent;
        return {
            lists: addItem(context.lists, addItemEvent.listId, {
                sku: addItemEvent.sku,
                name: addItemEvent.name,
                qty: addItemEvent.qty,
            }),
            dirty: true,
        };
    }),

    updateListItemQty: assign(({ context, event }) => {
        const updateEvent = event as ShopUpdateItemQtyEvent;
        return {
            lists: updateItemQty(context.lists, updateEvent.listId, updateEvent.sku, updateEvent.qty),
            dirty: true,
        };
    }),

    removeListItem: assign(({ context, event }) => {
        const removeEvent = event as ShopRemoveItemEvent;
        return {
            lists: removeItem(context.lists, removeEvent.listId, removeEvent.sku),
            dirty: true,
        };
    }),

    openCart: assign(({ context }) => ({
        lists: setListEnabled(context.lists, 'cart', true),
        dirty: true,
    })),

    openAutoship: assign(({ context }) => {
        return {
            lists: setListEnabled(context.lists, 'auto', true),
            dirty: true,
        };
    }),

    clearCart: assign(({ context }) => {
        return {
        lists: context.lists.map(list => (
            list.id === 'cart'
                ? { ...list, items: [], updatedAt: new Date().toISOString() }
                : list
        )),
        dirty: true,
    };}),

    searchProducts: assign(({ context, event }) => {
        const searchEvent = event as ShopSearchProductsEvent;
        return {
            // placeholder orchestration marker for now
            lastError: searchEvent.query ? null : context.lastError,
        };
    }),

    persistLists: ({ context }: { context: ShopContext; }) => {
        saveLists(context.lists);
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
