/**
 * petblack namespace — English strings.
 *
 * Every `petblack.*` key used across widgets, settings sections, and views
 * is defined here. The structure mirrors the shelly convention:
 *
 *   petblack.widgets.<name>.label            — WorkspaceWidgetEntry label (floating widget chrome)
 *   petblack.widgets.<name>.tooltip          — WorkspaceWidgetEntry tooltip
 *   petblack.widgets.<name>.toggles.show.*   — show toggle ToggleEntry (separate from widget entry)
 *   petblack.dialogs.settings.sections.<name>.label   — settings section label
 *   petblack.dialogs.settings.sections.<name>.tooltip — settings section tooltip
 *   petblack.views.<name>.label              — view label
 */

const petblackEn = {
    petblack: {
        dialogs: {
            settings: {
                sections: {
                    shop: {
                        label: 'Shop',
                        tooltip: 'Shop settings',
                    },
                    shopper: {
                        label: 'Shopper',
                        tooltip: 'Shopper profile settings',
                    },
                    pet: {
                        label: 'Pet',
                        tooltip: 'Pet profile settings',
                    },
                },
            },
        },
        views: {
            explore: {
                label: 'Product Explorer',
            },
        },
        widgets: {
            /** WorkspaceWidgetEntry — `buddyWidgetEntry` in install; not the show/open toggles. */
            buddy: {
                label: 'Buddy',
                tooltip: 'Open Buddy chat',
                toggles: {
                    show: {
                        label: 'Buddy show',
                        on: 'Hide Buddy',
                        off: 'Show Buddy',
                        tooltip: 'Toggle Buddy chat',
                        labelOn: 'Hide Buddy',
                        labelOff: 'Show Buddy',
                    },
                    open: {
                        label: 'Buddy open',
                        on: 'Collapse Buddy',
                        off: 'Expand Buddy',
                        tooltip: 'Toggle Buddy dialog',
                        labelOn: 'Collapse Buddy',
                        labelOff: 'Expand Buddy',
                    },
                },
            },
            /** WorkspaceWidgetEntry + show toggle for the debug console widget. */
            debug: {
                label: 'Debug',
                tooltip: 'Open Buddy debug console',
                toggles: {
                    show: {
                        label: 'Debug',
                        on: 'Hide debug',
                        off: 'Show debug',
                        tooltip: 'Toggle debug console',
                        labelOn: 'Hide debug',
                        labelOff: 'Show debug',
                    },
                },
            },
            cart: {
                label: 'Shopping Cart',
                tooltip: 'View and manage your shopping cart',
                toggles: {
                    show: {
                        label: 'Shopping Cart',
                        on: 'Hide Cart',
                        off: 'Show Cart',
                        tooltip: 'Show or hide the shopping cart widget',
                        labelOn: 'Hide Cart',
                        labelOff: 'Show Cart',
                    },
                    open: {
                        label: 'Cart Details',
                        on: 'Minimize Cart',
                        off: 'Expand Cart',
                        tooltip: 'Open or close cart details',
                        labelOn: 'Minimize Cart',
                        labelOff: 'Expand Cart',
                    },
                },
            },
            bucket: {
                label: 'Shopping Lists',
                tooltip: 'Manage your shopping lists and categories',
                toggles: {
                    open: {
                        label: 'List Manager',
                        on: 'Close Lists',
                        off: 'Open Lists',
                        tooltip: 'Show or hide shopping list manager',
                        labelOn: 'Close Lists',
                        labelOff: 'Open Lists',
                    },
                    show: {
                        label: 'Shopping Lists',
                        on: 'Hide Lists',
                        off: 'Show Lists',
                        tooltip: 'Toggle shopping lists visibility',
                        labelOn: 'Hide Lists',
                        labelOff: 'Show Lists',
                    },
                },
            },
            want: {
                label: 'Wish List',
                tooltip: 'Items you want to buy in the future',
                toggles: {
                    open: {
                        label: 'Wish List',
                        on: 'Close Wish List',
                        off: 'Open Wish List',
                        tooltip: 'Show or hide your wish list',
                        labelOn: 'Close Wish List',
                        labelOff: 'Open Wish List',
                    },
                    show: {
                        label: 'Wish List',
                        on: 'Hide Wish List',
                        off: 'Show Wish List',
                        tooltip: 'Toggle wish list visibility',
                        labelOn: 'Hide Wish List',
                        labelOff: 'Show Wish List',
                    },
                },
            },
            need: {
                label: 'Essentials',
                tooltip: 'Essential items you need to purchase soon',
                toggles: {
                    open: {
                        label: 'Essentials List',
                        on: 'Close Essentials',
                        off: 'Open Essentials',
                        tooltip: 'Show or hide your essentials list',
                        labelOn: 'Close Essentials',
                        labelOff: 'Open Essentials',
                    },
                    show: {
                        label: 'Essentials',
                        on: 'Hide Essentials',
                        off: 'Show Essentials',
                        tooltip: 'Toggle essentials list visibility',
                        labelOn: 'Hide Essentials',
                        labelOff: 'Show Essentials',
                    },
                },
            },
            have: {
                label: 'Inventory',
                tooltip: 'Items you already own or have in stock',
                toggles: {
                    open: {
                        label: 'Inventory List',
                        on: 'Close Inventory',
                        off: 'Open Inventory',
                        tooltip: 'Show or hide your inventory list',
                        labelOn: 'Close Inventory',
                        labelOff: 'Open Inventory',
                    },
                    show: {
                        label: 'Inventory',
                        on: 'Hide Inventory',
                        off: 'Show Inventory',
                        tooltip: 'Toggle inventory list visibility',
                        labelOn: 'Hide Inventory',
                        labelOff: 'Show Inventory',
                    },
                },
            },
            pick: {
                label: 'Store Pickup',
                tooltip: 'Items reserved for in-store pickup',
                toggles: {
                    open: {
                        label: 'Pickup List',
                        on: 'Close Pickup',
                        off: 'Open Pickup',
                        tooltip: 'Show or hide store pickup list',
                        labelOn: 'Close Pickup',
                        labelOff: 'Open Pickup',
                    },
                    show: {
                        label: 'Store Pickup',
                        on: 'Hide Pickup',
                        off: 'Show Pickup',
                        tooltip: 'Toggle store pickup list visibility',
                        labelOn: 'Hide Pickup',
                        labelOff: 'Show Pickup',
                    },
                },
            },
            auto: {
                label: 'Auto-Ship',
                tooltip: 'Items scheduled for automatic recurring delivery',
                toggles: {
                    open: {
                        label: 'Auto-Ship List',
                        on: 'Close Auto-Ship',
                        off: 'Open Auto-Ship',
                        tooltip: 'Show or hide auto-ship subscription list',
                        labelOn: 'Close Auto-Ship',
                        labelOff: 'Open Auto-Ship',
                    },
                    show: {
                        label: 'Auto-Ship',
                        on: 'Hide Auto-Ship',
                        off: 'Show Auto-Ship',
                        tooltip: 'Toggle auto-ship list visibility',
                        labelOn: 'Hide Auto-Ship',
                        labelOff: 'Show Auto-Ship',
                    },
                },
            },
            drug: {
                label: 'Pharmacy',
                tooltip: 'Prescription and OTC medications requiring verification',
                toggles: {
                    open: {
                        label: 'Pharmacy List',
                        on: 'Close Pharmacy',
                        off: 'Open Pharmacy',
                        tooltip: 'Show or hide pharmacy medication list',
                        labelOn: 'Close Pharmacy',
                        labelOff: 'Open Pharmacy',
                    },
                    show: {
                        label: 'Pharmacy',
                        on: 'Hide Pharmacy',
                        off: 'Show Pharmacy',
                        tooltip: 'Toggle pharmacy list visibility',
                        labelOn: 'Hide Pharmacy',
                        labelOff: 'Show Pharmacy',
                    },
                },
            },
            diet: {
                label: 'Special Diet',
                tooltip: 'Dietary items that may require special approval or handling',
                toggles: {
                    open: {
                        label: 'Diet List',
                        on: 'Close Diet Items',
                        off: 'Open Diet Items',
                        tooltip: 'Show or hide special diet items list',
                        labelOn: 'Close Diet Items',
                        labelOff: 'Open Diet Items',
                    },
                    show: {
                        label: 'Special Diet',
                        on: 'Hide Diet Items',
                        off: 'Show Diet Items',
                        tooltip: 'Toggle special diet items visibility',
                        labelOn: 'Hide Diet Items',
                        labelOff: 'Show Diet Items',
                    },
                },
            }
        },
    },
};

export default petblackEn;
