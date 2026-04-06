/**
 * widgets/diet/install
 *
 * Installs the Diet widget into the shelly shell.
 *
 * Registers:
 * - Show toggle entry — controls widget visibility
 * - Open toggle entry — controls collapsed button vs. expanded dialog
 * - Widget entry — WorkspaceWidgetEntry at DIET_WIDGET_PATH via installWidget
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { WorkspaceEntryTypes, installWorkspaceEntry } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { DIET_WIDGET_PATH, DIET_SHOW_TOGGLE_PATH, DIET_OPEN_TOGGLE_PATH } from './diet-path';
import dietShowToggleEntry from './toggles/diet-show-toggle';
import dietOpenToggleEntry from './toggles/diet-open-toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyDietWidget = lazy(() => import('./diet-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const dietWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.diet.label',
    tooltip: 'petblack.widgets.diet.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'diet' },
    component: LazyDietWidget,
    toggle: DIET_OPEN_TOGGLE_PATH,
    showToggle: DIET_SHOW_TOGGLE_PATH,
};

// ── install ───────────────────────────────────────────────────────────────────

const installDietWidget = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    const cleanupShowToggle = installWorkspaceEntry(get, set, DIET_SHOW_TOGGLE_PATH, dietShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, DIET_OPEN_TOGGLE_PATH, dietOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <DietWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, dietWidgetEntry);

    return () => {
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installDietWidget;
