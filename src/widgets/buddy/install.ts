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
import { installWorkspaceEntry, WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { BUDDY_WIDGET_PATH, BUDDY_OPEN_TOGGLE_PATH, BUDDY_SHOW_TOGGLE_PATH } from './buddy-widget-path';
import buddyShowToggleEntry from './toggles/buddy-show-toggle';
import buddyOpenToggleEntry from './toggles/buddy-open-toggle';

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
    toggle: [...BUDDY_OPEN_TOGGLE_PATH],
    showToggle: [...BUDDY_SHOW_TOGGLE_PATH],
};

// ── install ───────────────────────────────────────────────────────────────────

const installBuddy = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    const cleanupShowToggle = installWorkspaceEntry(get, set, BUDDY_SHOW_TOGGLE_PATH, buddyShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, BUDDY_OPEN_TOGGLE_PATH, buddyOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <BuddyWidgetWrapper> when toggle is true
    const cleanupWidget = installWidget(get, set, buddyWidgetEntry);

    return () => {
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installBuddy;
