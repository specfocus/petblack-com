import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import cartShowAtom from '../atoms/cart-show-atom';

export const cartShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: ShoppingCartRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.cart.toggles.show.label',
    tooltip: 'petblack.widgets.cart.toggles.show.tooltip',
    size: Sizes.Small,
    atom: cartShowAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.cart.toggles.show.labelOn',
        labelOff: 'petblack.widgets.cart.toggles.show.labelOff',
    },
};

export default cartShowToggleEntry;
