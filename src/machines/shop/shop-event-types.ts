export enum ShopEventTypes {
    Bootstrap = 'shop.bootstrap',
    Hydrate = 'shop.hydrate',
    ToggleListEnabled = 'shop.toggleListEnabled',
    CreateCustomList = 'shop.createCustomList',
    RemoveCustomList = 'shop.removeCustomList',
    AddItem = 'shop.addItem',
    UpdateItemQty = 'shop.updateItemQty',
    RemoveItem = 'shop.removeItem',
    PersistRequested = 'shop.persistRequested',
    PersistSucceeded = 'shop.persistSucceeded',
    PersistFailed = 'shop.persistFailed',
}

export type ShopEventType = `${ShopEventTypes}`;
