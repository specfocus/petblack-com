import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import dietShowAtom from '../atoms/diet-show-atom';

export const dietShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: ShoppingCartRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.diet.toggles.show.label',
    tooltip: 'petblack.widgets.diet.toggles.show.tooltip',
    size: Sizes.Small,
    atom: dietShowAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.diet.toggles.show.labelOn',
        labelOff: 'petblack.widgets.diet.toggles.show.labelOff',
    },
};

export default dietShowToggleEntry;
