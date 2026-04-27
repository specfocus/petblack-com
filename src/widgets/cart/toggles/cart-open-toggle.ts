import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom from '@specfocus/atoms/lib/toggle';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import cartOpenAtom from '../atoms/cart-open-atom';

const cartOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.cart.toggles.open.label',
    tooltip: 'petblack.widgets.cart.toggles.open.tooltip',
    size: Sizes.Small,
    atom: cartOpenAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.cart.toggles.open.labelOn',
        labelOff: 'petblack.widgets.cart.toggles.open.labelOff',
    },
};

export default cartOpenToggleEntry;
