/**
 * widgets/list/install
 *
 * Installs the List widget into the shelly shell.
 *
 * Registers:
 * - Toggle entry — ToggleEntry at LIST_TOGGLE_PATH (renders 📋 dial button)
 * - Widget entry — WorkspaceWidgetEntry at LIST_WIDGET_PATH via installWidget
 * - Dial button  — registers the list toggle under shelly's dial/actions registry
 */

import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import workspaceTreeAtom, { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { installDialAction } from '@specfocus/shelly/lib/widgets/dial/actions/dial-action-entry';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { LIST_WIDGET_PATH } from './list-path';
import listWorkspaceEntry, { LIST_TOGGLE_PATH } from './toggles/list-show-toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyListWidget = lazy(() => import('./list-widget'));

// ── widget entry ──────────────────────────────────────────────────────────────

const listWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.list.label',
    tooltip: 'petblack.widgets.list.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'list' },
    component: LazyListWidget,
    toggle: [...LIST_TOGGLE_PATH],
};

// ── install ───────────────────────────────────────────────────────────────────

const installList = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    // 1. Toggle entry — must be in the tree before the widget reads it
    set(workspaceTreeAtom(LIST_TOGGLE_PATH), listWorkspaceEntry);

    // 2. Widget entry — <Widgets> renders <ListWidget> when toggle is true
    const cleanupWidget = installWidget(get, set, listWidgetEntry);

    // 3. Dial button — adds the 📋 button to the speed-dial
    const cleanupDialAction = installDialAction(get, set, 'list', listWorkspaceEntry);

    return () => {
        cleanupDialAction();
        cleanupWidget();
        workspaceTreeAtom.remove(LIST_TOGGLE_PATH);
    };
};

export default installList;
