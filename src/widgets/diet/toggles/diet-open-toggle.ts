import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom from '@specfocus/atoms/lib/toggle';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import dietOpenAtom from '../atoms/diet-open-atom';

const dietOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.diet.toggles.open.label',
    tooltip: 'petblack.widgets.diet.toggles.open.tooltip',
    size: Sizes.Small,
    atom: dietOpenAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.diet.toggles.open.labelOn',
        labelOff: 'petblack.widgets.diet.toggles.open.labelOff',
    },
};

export default dietOpenToggleEntry;
