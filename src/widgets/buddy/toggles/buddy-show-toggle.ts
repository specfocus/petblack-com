import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import buddyShowAtom from '../atoms/buddy-show-atom';

export const buddyShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: PetsRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.buddy.toggles.show.label',
    tooltip: 'petblack.widgets.buddy.toggles.show.tooltip',
    size: Sizes.Small,
    atom: buddyShowAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.buddy.toggles.show.labelOn',
        labelOff: 'petblack.widgets.buddy.toggles.show.labelOff',
    },
};

export default buddyShowToggleEntry;
