import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { WorkspaceEntryTypes, installWorkspaceEntry } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { installDialAction } from '@specfocus/shelly/lib/widgets/dial/actions/dial-action-entry';
import { BUDGET_OPEN_TOGGLE_PATH, BUDGET_SHOW_TOGGLE_PATH } from './budget-widget-path';
import budgetOpenToggleEntry from './toggles/budget-open-toggle';
import budgetShowToggleEntry from './toggles/budget-show-toggle';

const LazyBudgetWidget = lazy(() => import('./budget-widget'));

const budgetWidgetEntry: WorkspaceWidgetEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    label: 'petblack.widgets.budget.label',
    tooltip: 'petblack.widgets.budget.tooltip',
    resource: { '@type': WIDGET, data: {}, name: 'budget' },
    component: LazyBudgetWidget,
    toggle: BUDGET_OPEN_TOGGLE_PATH,
    showToggle: BUDGET_SHOW_TOGGLE_PATH,
};

const installBudget = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanupShowToggle = installWorkspaceEntry(get, set, BUDGET_SHOW_TOGGLE_PATH, budgetShowToggleEntry);
    const cleanupOpenToggle = installWorkspaceEntry(get, set, BUDGET_OPEN_TOGGLE_PATH, budgetOpenToggleEntry);
    const cleanupWidget = installWidget(get, set, budgetWidgetEntry);
    const cleanupDialAction = installDialAction(get, set, 'budget', budgetShowToggleEntry);

    return () => {
        cleanupDialAction();
        cleanupWidget();
        cleanupOpenToggle();
        cleanupShowToggle();
    };
};

export default installBudget;
