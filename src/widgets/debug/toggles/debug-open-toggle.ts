import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import debugOpenAtom from '../atoms/debug-open-atom';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';

const debugOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.debug.toggles.open.label',
    tooltip: 'petblack.widgets.debug.toggles.open.tooltip',
    size: Sizes.Small,
    atom: debugOpenAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.debug.toggles.open.labelOn',
        labelOff: 'petblack.widgets.debug.toggles.open.labelOff',
    },
};

export default debugOpenToggleEntry;
