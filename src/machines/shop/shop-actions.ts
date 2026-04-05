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
import { ShopEventTypes } from './shop-event-types';
import shopSetup from './shop-setup';
import type {
    ShopAddItemEvent,
    ShopCreateCustomListEvent,
    ShopHydrateEvent,
    ShopRemoveCustomListEvent,
    ShopRemoveItemEvent,
    ShopToggleListEnabledEvent,
    ShopUpdateItemQtyEvent,
} from './shop-events';

const { assign } = shopSetup;

const shopActions = {
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
