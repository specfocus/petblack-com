import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import budgetOpenAtom from '../atoms/budget-open-atom';

const budgetOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.budget.toggles.open.label',
    tooltip: 'petblack.widgets.budget.toggles.open.tooltip',
    size: Sizes.Small,
    atom: budgetOpenAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.budget.toggles.open.labelOn',
        labelOff: 'petblack.widgets.budget.toggles.open.labelOff',
    },
};

export default budgetOpenToggleEntry;
