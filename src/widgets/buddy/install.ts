/**
 * widgets/buddy/install
 *
 * Installs the Buddy chat widget into the shelly shell for the petblack app.
 *
 * Follows the same `(get, set) => Cleanup` pattern used by all shelly
 * installers (see `packages/robotify/src/widgets/calculator/install.ts`).
 *
 * Registers:
 * - **Show toggle entry** — controls widget visibility.
 * - **Open toggle entry** — controls button/dialog expansion.
 * - **Widget entry** — `WorkspaceWidgetEntry` at `BUDDY_WIDGET_PATH` via
 *   `installWidget` so `<Widgets />` floats `<BuddyWidgetWrapper />`.
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import workspaceTreeAtom from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { BUDDY_WIDGET_PATH } from './buddy-widget-path';
import buddyShowToggleEntry from './toggles/buddy-show-toggle';
import buddyOpenToggleEntry from './toggles/buddy-open-toggle';
import { BUDDY_OPEN_TOGGLE_PATH, BUDDY_SHOW_TOGGLE_PATH } from './buddy-widget-path';

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
    toggle: [...BUDDY_SHOW_TOGGLE_PATH],
};

// ── install ───────────────────────────────────────────────────────────────────

const installBuddy = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    set(workspaceTreeAtom(BUDDY_SHOW_TOGGLE_PATH), buddyShowToggleEntry);
    set(workspaceTreeAtom(BUDDY_OPEN_TOGGLE_PATH), buddyOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <BuddyWidgetWrapper> when toggle is true
    const cleanupWidget = installWidget(get, set, buddyWidgetEntry);

    return () => {
        cleanupWidget();
        workspaceTreeAtom.remove(BUDDY_OPEN_TOGGLE_PATH);
        workspaceTreeAtom.remove(BUDDY_SHOW_TOGGLE_PATH);
    };
};

export default installBuddy;
