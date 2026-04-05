/**
 * petblack namespace — English strings.
 *
 * Every `petblack.*` key used across widgets, settings sections, and views
 * is defined here. The structure mirrors the shelly convention:
 *
 *   petblack.widgets.<name>.label            — widget label
 *   petblack.widgets.<name>.tooltip          — widget tooltip
 *   petblack.widgets.<name>.toggles.show.*   — show/hide toggle strings
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
                label: 'Explore',
            },
        },
        widgets: {
            buddy: {
                label: 'Buddy',
                tooltip: 'Open Buddy chat',
                toggles: {
                    show: {
                        label: 'Buddy',
                        on: 'Hide Buddy',
                        off: 'Show Buddy',
                        tooltip: 'Toggle Buddy chat',
                        labelOn: 'Hide Buddy',
                        labelOff: 'Show Buddy',
                    },
                },
            },
            cart: {
                label: 'Cart',
                tooltip: 'Open cart',
                toggles: {
                    show: {
                        label: 'Cart',
                        on: 'Hide Cart',
                        off: 'Show Cart',
                        tooltip: 'Toggle cart',
                        labelOn: 'Hide Cart',
                        labelOff: 'Show Cart',
                    },
                },
            },
            list: {
                label: 'List',
                tooltip: 'Open shopping list',
                toggles: {
                    show: {
                        label: 'List',
                        on: 'Hide List',
                        off: 'Show List',
                        tooltip: 'Toggle shopping list',
                        labelOn: 'Hide List',
                        labelOff: 'Show List',
                    },
                },
            },
        },
    },
};

export default petblackEn;
