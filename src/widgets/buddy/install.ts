/**
 * widgets/buddy/install
 *
 * Installs the Buddy chat widget into the shelly shell for the petblack app.
 *
 * Follows the same `(get, set) => Cleanup` pattern used by all shelly
 * installers (see `packages/robotify/src/widgets/calculator/install.ts`).
 *
 * Registers:
 * - **Toggle entry** — `ToggleEntry` at `BUDDY_TOGGLE_PATH` so the Dial can
 *   resolve and render it as a 🐾 icon button.
 * - **Widget entry** — `WorkspaceWidgetEntry` at `BUDDY_WIDGET_PATH` via
 *   `installWidget` so `<Widgets />` floats `<BuddyWidgetWrapper />`.
 * - **Dial button** — registers the buddy toggle structurally under
 *   shelly's `widgets/dial/actions/*` registry.
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import workspaceTreeAtom from '@specfocus/atoms/lib/workspace';
import { installDialAction } from '@specfocus/shelly/lib/widgets/dial/actions/dial-action-entry';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { BUDDY_WIDGET_PATH } from './buddy-widget-path';
import buddyWorkspaceEntry, { BUDDY_TOGGLE_PATH } from './toggles/buddy-show-toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyBuddyWidget = lazy(() => import('./buddy-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const buddyWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.buddy.label',
    tooltip: 'petblack.widgets.buddy.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'buddy' },
    component: LazyBuddyWidget,
    toggle: [...BUDDY_TOGGLE_PATH],
};

// ── install ───────────────────────────────────────────────────────────────────

const installBuddy = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entry — must be in the tree before the widget reads it
    set(workspaceTreeAtom(BUDDY_TOGGLE_PATH), buddyWorkspaceEntry);

    // 2. Widget entry — <Widgets> renders <BuddyWidgetWrapper> when toggle is true
    const cleanupWidget = installWidget(get, set, buddyWidgetEntry);

    // 3. Dial button — adds the 🐾 button to the speed-dial
    const cleanupDialAction = installDialAction(get, set, 'buddy', buddyWorkspaceEntry);

    return () => {
        cleanupDialAction();
        cleanupWidget();
        workspaceTreeAtom.remove(BUDDY_TOGGLE_PATH);
    };
};

export default installBuddy;
