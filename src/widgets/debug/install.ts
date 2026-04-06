import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { installWorkspaceEntry, WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { installDialAction } from '@specfocus/shelly/lib/widgets/dial/actions/dial-action-entry';
import { lazy } from 'react';
import { DEBUG_OPEN_TOGGLE_PATH, DEBUG_SHOW_TOGGLE_PATH } from './debug-widget-path';
import debugOpenToggleEntry from './toggles/debug-open-toggle';
import debugShowToggleEntry from './toggles/debug-show-toggle';

const LazyDebugWidget = lazy(() => import('./debug-widget'));

const debugWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.debug.label',
    tooltip: 'petblack.widgets.debug.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'debug' },
    component: LazyDebugWidget,
    toggle: DEBUG_OPEN_TOGGLE_PATH,
    showToggle: DEBUG_SHOW_TOGGLE_PATH,
};

const installDebug = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanupWidget = installWidget(get, set, debugWidgetEntry);
    const cleanupShowToggle = installWorkspaceEntry(get, set, DEBUG_SHOW_TOGGLE_PATH, debugShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, DEBUG_OPEN_TOGGLE_PATH, debugOpenToggleEntry);
    const cleanupDialActionShow = installDialAction(get, set, 'debug', debugShowToggleEntry);

    return () => {
        cleanupWidget();
        cleanupShowToggle();
        cleanupOpenToggle();
        cleanupDialActionShow();
    };
};

export default installDebug;
