/**
 * widgets/cart/install
 *
 * Installs the Cart checkout widget into the shelly shell.
 *
 * Registers:
 * - Toggle entry — ToggleEntry at CART_TOGGLE_PATH (renders 🛒 dial button)
 * - Widget entry — WorkspaceWidgetEntry at CART_WIDGET_PATH via installWidget
 * - Dial button  — registers the cart toggle under shelly's dial/actions registry
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import workspaceTreeAtom, { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { installDialAction } from '@specfocus/shelly/lib/widgets/dial/actions/dial-action-entry';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { CART_WIDGET_PATH } from './cart-path';
import cartWorkspaceEntry, { CART_TOGGLE_PATH } from './toggles/cart-show-toggle';

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
    toggle: [...CART_TOGGLE_PATH],
};

// ── install ───────────────────────────────────────────────────────────────────

const installCart = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entry — must be in the tree before the widget reads it
    set(workspaceTreeAtom(CART_TOGGLE_PATH), cartWorkspaceEntry);

    // 2. Widget entry — <Widgets> renders <CartWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, cartWidgetEntry);

    // 3. Dial button — adds the 🛒 button to the speed-dial
    const cleanupDialAction = installDialAction(get, set, 'cart', cartWorkspaceEntry);

    return () => {
        cleanupDialAction();
        cleanupWidget();
        workspaceTreeAtom.remove(CART_TOGGLE_PATH);
    };
};

export default installCart;
