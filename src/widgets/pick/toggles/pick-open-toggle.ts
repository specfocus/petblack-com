import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom from '@specfocus/atoms/lib/toggle';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import pickOpenAtom from '../atoms/pick-open-atom';

const pickOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.pick.toggles.open.label',
    tooltip: 'petblack.widgets.pick.toggles.open.tooltip',
    size: Sizes.Small,
    atom: pickOpenAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.pick.toggles.open.labelOn',
        labelOff: 'petblack.widgets.pick.toggles.open.labelOff',
    },
};

export default pickOpenToggleEntry;
