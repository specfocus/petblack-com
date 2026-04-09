import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import budgetShowAtom from '../atoms/budget-show-atom';

export const budgetShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: SavingsRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.budget.toggles.show.label',
    tooltip: 'petblack.widgets.budget.toggles.show.tooltip',
    size: Sizes.Small,
    atom: budgetShowAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.budget.toggles.show.labelOn',
        labelOff: 'petblack.widgets.budget.toggles.show.labelOff',
    },
};

export default budgetShowToggleEntry;
