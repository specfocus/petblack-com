import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import pickShowAtom from '../atoms/pick-show-atom';

export const pickShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: ShoppingCartRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.pick.toggles.show.label',
    tooltip: 'petblack.widgets.pick.toggles.show.tooltip',
    size: Sizes.Small,
    atom: pickShowAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.pick.toggles.show.labelOn',
        labelOff: 'petblack.widgets.pick.toggles.show.labelOff',
    },
};

export default pickShowToggleEntry;
