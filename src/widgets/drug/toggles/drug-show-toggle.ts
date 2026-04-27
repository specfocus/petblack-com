import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import drugShowAtom from '../atoms/drug-show-atom';

export const drugShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: ShoppingCartRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.drug.toggles.show.label',
    tooltip: 'petblack.widgets.drug.toggles.show.tooltip',
    size: Sizes.Small,
    atom: drugShowAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.drug.toggles.show.labelOn',
        labelOff: 'petblack.widgets.drug.toggles.show.labelOff',
    },
};

export default drugShowToggleEntry;
