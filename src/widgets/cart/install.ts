/**
 * widgets/cart/install
 *
 * Installs the Cart checkout widget into the shelly shell.
 *
 * Registers:
 * - Show toggle entry — controls widget visibility
 * - Open toggle entry — controls collapsed button vs. expanded dialog
 * - Widget entry — WorkspaceWidgetEntry at CART_WIDGET_PATH via installWidget
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import workspaceTreeAtom, { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { CART_WIDGET_PATH } from './cart-widget-path';
import cartShowToggleEntry from './toggles/cart-show-toggle';
import cartOpenToggleEntry from './toggles/cart-open-toggle';
import { CART_SHOW_TOGGLE_PATH, CART_OPEN_TOGGLE_PATH } from './cart-widget-path';
import { installWorkspaceEntry } from '@specfocus/atoms/src/workspace';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyCartWidget = lazy(() => import('./cart-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const cartWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.cart.label',
    tooltip: 'petblack.widgets.cart.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'cart' },
    component: LazyCartWidget,
    toggle: CART_SHOW_TOGGLE_PATH,
};

// ── install ───────────────────────────────────────────────────────────────────

const installCartWidget = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    const cleanupShowToggle = installWorkspaceEntry(get, set, CART_SHOW_TOGGLE_PATH, cartShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, CART_OPEN_TOGGLE_PATH, cartOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <CartWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, cartWidgetEntry);

    return () => {
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installCartWidget;
