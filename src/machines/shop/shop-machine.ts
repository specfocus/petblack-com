import type { Actor, SnapshotFrom } from '@specfocus/atoms/lib/machine';
import shopSetup from './shop-setup';
import shopActions from './shop-actions';
import { ShopEventTypes } from './shop-event-types';
import ShopStates from './shop-states';
import { createInitialShopContext } from './shop-context';
import { FeedbackActionKeys, feedbackOn } from '@specfocus/shelly/lib/machines/feedback';

export const SHOP_MACHINE_PATH = ['petblack', 'machines', 'shop'] as const;
export const SHOP_SYSTEM_ID = SHOP_MACHINE_PATH.join('/');

const shopMachine = shopSetup.extend({ actions: shopActions }).createMachine({
    id: SHOP_SYSTEM_ID,
    initial: ShopStates.Ready,
    context: ({ input }) => createInitialShopContext(input),
    on: {
        ...feedbackOn([
            FeedbackActionKeys.RecordFeedback,
            'setActiveViewFromFeedback',
            'setBreadcrumbsFromFeedback',
        ]),
    },
    states: {
        [ShopStates.Ready]: {
            on: {
                [ShopEventTypes.Hydrate]: {
                    actions: ['hydrate'],
                },
                [ShopEventTypes.OpenBucket]: {
                    actions: ['openBucket', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.SearchProducts]: {
                    actions: ['searchProducts'],
                },
                [ShopEventTypes.CreateCustomList]: {
                    actions: ['createCustomList', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.RemoveCustomList]: {
                    actions: ['removeCustomList', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.AddItem]: {
                    actions: ['addItemToList', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.UpdateItemQty]: {
                    actions: ['updateListItemQty', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.RemoveItem]: {
                    actions: ['removeListItem', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.ClearCart]: {
                    actions: ['clearCart', 'persistLists', 'markPersisted'],
                },
                [ShopEventTypes.PersistRequested]: {
                    actions: ['persistLists', 'markPersisted'],
                },
                [ShopEventTypes.PersistFailed]: {
                    actions: ['setPersistError'],
                },
                [ShopEventTypes.ToggleBucketOpen]: {
                    actions: ['toggleBucketOpen'],
                },
                [ShopEventTypes.ToggleBucketShow]: {
                    actions: ['toggleBucketShow'],
                },
                [ShopEventTypes.ToggleBuddyOpen]: {
                    actions: ['toggleBuddyOpen'],
                },
                [ShopEventTypes.ToggleBuddyShow]: {
                    actions: ['toggleBuddyShow'],
                },
                [ShopEventTypes.ToggleDebugOpen]: {
                    actions: ['toggleDebugOpen'],
                },
                [ShopEventTypes.ToggleDebugShow]: {
                    actions: ['toggleDebugShow'],
                },
            },
        },
    },
});

export type ShopMachine = typeof shopMachine;
export type ShopActor = Actor<ShopMachine>;
export type ShopSnapshot = SnapshotFrom<ShopMachine>;

export default shopMachine;
