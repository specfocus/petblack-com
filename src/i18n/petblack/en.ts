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
                label: 'Explore',
            },
        },
        widgets: {
            /** WorkspaceWidgetEntry — `buddyWidgetEntry` in install; not the show/open toggles. */
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
                    open: {
                        label: 'Buddy dialog',
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
                    open: {
                        label: 'Cart dialog',
                        on: 'Collapse Cart',
                        off: 'Expand Cart',
                        tooltip: 'Toggle cart dialog',
                        labelOn: 'Collapse Cart',
                        labelOff: 'Expand Cart',
                    },
                },
            },
            list: {
                label: 'Bucket',
                tooltip: 'Open shopping bucket',
                cart: {
                    label: 'Cart bucket',
                    tooltip: 'Cart checkout bucket',
                },
                want: {
                    label: 'Want bucket',
                    tooltip: 'Things you want to buy later',
                },
                need: {
                    label: 'Need bucket',
                    tooltip: 'Things you need soon',
                },
                have: {
                    label: 'Have bucket',
                    tooltip: 'Things you already have',
                },
                pick: {
                    label: 'Pick up bucket',
                    tooltip: 'Things to reserve for store pickup',
                },
                auto: {
                    label: 'Autoship bucket',
                    tooltip: 'Things scheduled for recurring shipment',
                },
                drug: {
                    label: 'Pharmacy bucket',
                    tooltip: 'Medication items that require verification',
                },
                diet: {
                    label: 'Diet bucket',
                    tooltip: 'Dietary items that may require approval',
                },
                toggles: {
                    show: {
                        label: 'Bucket',
                        on: 'Hide bucket',
                        off: 'Show bucket',
                        tooltip: 'Toggle shopping bucket',
                        labelOn: 'Hide bucket',
                        labelOff: 'Show bucket',
                    },
                },
            },
        },
    },
};

export default petblackEn;
