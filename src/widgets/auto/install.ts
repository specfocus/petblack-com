/**
 * widgets/auto/install
 *
 * Installs the Auto-ship widget into the shelly shell.
 *
 * Registers:
 * - Show toggle entry — controls widget visibility
 * - Open toggle entry — controls collapsed button vs. expanded dialog
 * - Widget entry — WorkspaceWidgetEntry at AUTO_WIDGET_PATH via installWidget
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { WorkspaceEntryTypes, installWorkspaceEntry } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { AUTO_WIDGET_PATH, AUTO_SHOW_TOGGLE_PATH, AUTO_OPEN_TOGGLE_PATH } from './auto-widget-path';
import autoShowToggleEntry from './toggles/auto-show-toggle';
import autoOpenToggleEntry from './toggles/auto-open-toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyAutoWidget = lazy(() => import('./auto-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const autoWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.auto.label',
    tooltip: 'petblack.widgets.auto.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'auto' },
    component: LazyAutoWidget,
    toggle: AUTO_SHOW_TOGGLE_PATH,
};

// ── install ───────────────────────────────────────────────────────────────────

const installAutoWidget = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    const cleanupShowToggle = installWorkspaceEntry(get, set, AUTO_SHOW_TOGGLE_PATH, autoShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, AUTO_OPEN_TOGGLE_PATH, autoOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <AutoWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, autoWidgetEntry);

    return () => {
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installAutoWidget;
