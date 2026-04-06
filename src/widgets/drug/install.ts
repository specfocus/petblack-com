/**
 * widgets/drug/install
 *
 * Installs the Drug/medication widget into the shelly shell.
 *
 * Registers:
 * - Show toggle entry — controls widget visibility
 * - Open toggle entry — controls collapsed button vs. expanded dialog
 * - Widget entry — WorkspaceWidgetEntry at DRUG_WIDGET_PATH via installWidget
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { WorkspaceEntryTypes, installWorkspaceEntry } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { DRUG_WIDGET_PATH, DRUG_SHOW_TOGGLE_PATH, DRUG_OPEN_TOGGLE_PATH } from './drug-widget-path';
import drugShowToggleEntry from './toggles/drug-show-toggle';
import drugOpenToggleEntry from './toggles/drug-open-toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyDrugWidget = lazy(() => import('./drug-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const drugWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.drug.label',
    tooltip: 'petblack.widgets.drug.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'drug' },
    component: LazyDrugWidget,
    toggle: DRUG_OPEN_TOGGLE_PATH,
    showToggle: DRUG_SHOW_TOGGLE_PATH,
};

// ── install ───────────────────────────────────────────────────────────────────

const installDrugWidget = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entries — must be in the tree before the widget reads them
    const cleanupShowToggle = installWorkspaceEntry(get, set, DRUG_SHOW_TOGGLE_PATH, drugShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, DRUG_OPEN_TOGGLE_PATH, drugOpenToggleEntry);

    // 2. Widget entry — <Widgets> renders <DrugWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, drugWidgetEntry);

    return () => {
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installDrugWidget;
