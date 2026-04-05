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
                    actions: ['openBucket', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.SearchProducts]: {
                    actions: ['searchProducts'],
                },
                [ShopEventTypes.CreateCustomBucket]: {
                    actions: ['createCustomBucket', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.RemoveCustomBucket]: {
                    actions: ['removeCustomBucket', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.AddItem]: {
                    actions: ['addItemToBucket', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.UpdateItemQty]: {
                    actions: ['updateBucketItemQty', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.RemoveItem]: {
                    actions: ['removeBucketItem', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.ClearCart]: {
                    actions: ['clearCart', 'persistBuckets', 'markPersisted'],
                },
                [ShopEventTypes.PersistRequested]: {
                    actions: ['persistBuckets', 'markPersisted'],
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
