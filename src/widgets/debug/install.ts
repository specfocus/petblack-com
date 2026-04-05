import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import workspaceTreeAtom, { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { installDialAction } from '@specfocus/shelly/lib/widgets/dial/actions/dial-action-entry';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { DEBUG_WIDGET_PATH } from './debug-widget-path';
import debugWorkspaceEntry, { DEBUG_TOGGLE_PATH } from './toggles/debug-show-toggle';

const LazyDebugWidget = lazy(() => import('./debug-widget'));

const debugWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.debug.label',
    tooltip: 'petblack.widgets.debug.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'debug' },
    component: LazyDebugWidget,
    toggle: [...DEBUG_TOGGLE_PATH],
};

const installDebug = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    set(workspaceTreeAtom(DEBUG_TOGGLE_PATH), debugWorkspaceEntry);
    const cleanupWidget = installWidget(get, set, debugWidgetEntry);
    const cleanupDialAction = installDialAction(get, set, 'debug', debugWorkspaceEntry);

    return () => {
        cleanupDialAction();
        cleanupWidget();
        workspaceTreeAtom.remove(DEBUG_TOGGLE_PATH);
    };
};

export default installDebug;
