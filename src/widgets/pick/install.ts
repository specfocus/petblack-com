/**
 * widgets/pick/install
 *
 * Installs the Pick-up widget into the shelly shell.
 *
 * Registers:
 * - Show toggle entry — controls widget visibility
 * - Open toggle entry — controls collapsed button vs. expanded dialog
 * - Widget entry — WorkspaceWidgetEntry at PICK_WIDGET_PATH via installWidget
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { WorkspaceEntryTypes, installWorkspaceEntry } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { PICK_WIDGET_PATH, PICK_SHOW_TOGGLE_PATH, PICK_OPEN_TOGGLE_PATH } from './pick-widget-path';
import pickShowToggleEntry from './toggles/pick-show-toggle';
import pickOpenToggleEntry from './toggles/pick-open-toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyPickWidget = lazy(() => import('./pick-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const pickWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.pick.label',
    tooltip: 'petblack.widgets.pick.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'pick' },
    component: LazyPickWidget,
    toggle: PICK_OPEN_TOGGLE_PATH,
    showToggle: PICK_SHOW_TOGGLE_PATH,
};

// ── install ───────────────────────────────────────────────────────────────────

const installPickWidget = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    const cleanupShowToggle = installWorkspaceEntry(get, set, PICK_SHOW_TOGGLE_PATH, pickShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, PICK_OPEN_TOGGLE_PATH, pickOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <PickWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, pickWidgetEntry);

    return () => {
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installPickWidget;
