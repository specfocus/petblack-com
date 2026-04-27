import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import { TOGGLE, type ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import debugShowAtom from '../atoms/debug-show-atom';

export const debugShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    icon: BugReportRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.debug.toggles.show.label',
    tooltip: 'petblack.widgets.debug.toggles.show.tooltip',
    size: Sizes.Small,
    atom: debugShowAtom,
    resource: {
        '@type': TOGGLE,
        labelOn: 'petblack.widgets.debug.toggles.show.labelOn',
        labelOff: 'petblack.widgets.debug.toggles.show.labelOff',
    },
};

export default debugShowToggleEntry;
