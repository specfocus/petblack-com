export enum ShopEventTypes {
    Bootstrap = 'shop.bootstrap',
    Hydrate = 'shop.hydrate',
    OpenBucket = 'shop.openBucket',
    SearchProducts = 'shop.searchProducts',
    CreateCustomBucket = 'shop.createCustomBucket',
    RemoveCustomBucket = 'shop.removeCustomBucket',
    AddItem = 'shop.addItem',
    UpdateItemQty = 'shop.updateItemQty',
    RemoveItem = 'shop.removeItem',
    ClearCart = 'shop.clearCart',
    PersistRequested = 'shop.persistRequested',
    PersistSucceeded = 'shop.persistSucceeded',
    PersistFailed = 'shop.persistFailed',

    ToggleBucketOpen = 'shop.toggleBucketOpen',
    ToggleBucketShow = 'shop.toggleBucketShow',

    ToggleBuddyOpen = 'shop.toggleBuddyOpen',
    ToggleBuddyShow = 'shop.toggleBuddyShow',
    ToggleDebugOpen = 'shop.toggleDebugOpen',
    ToggleDebugShow = 'shop.toggleDebugShow'
}

export type ShopEventType = `${ShopEventTypes}`;
