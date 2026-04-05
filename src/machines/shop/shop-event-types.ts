export enum ShopEventTypes {
    Bootstrap = 'shop.bootstrap',
    Hydrate = 'shop.hydrate',
    OpenCart = 'shop.openCart',
    OpenAutoship = 'shop.openAutoship',
    SearchProducts = 'shop.searchProducts',
    ToggleListEnabled = 'shop.toggleListEnabled',
    CreateCustomList = 'shop.createCustomList',
    RemoveCustomList = 'shop.removeCustomList',
    AddItem = 'shop.addItem',
    UpdateItemQty = 'shop.updateItemQty',
    RemoveItem = 'shop.removeItem',
    ClearCart = 'shop.clearCart',
    PersistRequested = 'shop.persistRequested',
    PersistSucceeded = 'shop.persistSucceeded',
    PersistFailed = 'shop.persistFailed',
}

export type ShopEventType = `${ShopEventTypes}`;
