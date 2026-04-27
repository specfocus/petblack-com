import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import autoShowAtom from '../atoms/auto-show-atom';

export const autoShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: SyncRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.auto.toggles.show.label',
    tooltip: 'petblack.widgets.auto.toggles.show.tooltip',
    size: Sizes.Small,
    atom: autoShowAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.auto.toggles.show.labelOn',
        labelOff: 'petblack.widgets.auto.toggles.show.labelOff',
    },
};

export default autoShowToggleEntry;
