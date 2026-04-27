import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import buddyOpenAtom from '../atoms/buddy-open-atom';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';

const buddyOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.buddy.toggles.open.label',
    tooltip: 'petblack.widgets.buddy.toggles.open.tooltip',
    size: Sizes.Small,
    atom: buddyOpenAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.buddy.toggles.open.labelOn',
        labelOff: 'petblack.widgets.buddy.toggles.open.labelOff',
    },
};

export default buddyOpenToggleEntry;
