import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import autoOpenAtom from '../atoms/auto-open-atom';

const autoOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.auto.toggles.open.label',
    tooltip: 'petblack.widgets.auto.toggles.open.tooltip',
    size: Sizes.Small,
    atom: autoOpenAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.auto.toggles.open.labelOn',
        labelOff: 'petblack.widgets.auto.toggles.open.labelOff',
    },
};

export default autoOpenToggleEntry;
