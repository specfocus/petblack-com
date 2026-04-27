import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import dietShowAtom from '../atoms/diet-show-atom';

export const dietShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: ShoppingCartRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.diet.toggles.show.label',
    tooltip: 'petblack.widgets.diet.toggles.show.tooltip',
    size: Sizes.Small,
    atom: dietShowAtom,
    resource: {
        '@type': 'toggle',
        labelOn: 'petblack.widgets.diet.toggles.show.labelOn',
        labelOff: 'petblack.widgets.diet.toggles.show.labelOff',
    },
};

export default dietShowToggleEntry;
