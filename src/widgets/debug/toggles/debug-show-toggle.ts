import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import { DEBUG_WIDGET_PATH } from '../debug-widget-path';
import debugToggleAtom from '../atoms/debug-toggle-atom';

export const DEBUG_TOGGLE_PATH = [...DEBUG_WIDGET_PATH, 'toggles', 'show'];

export const debugShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: BugReportRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.debug.toggles.show.label',
    tooltip: 'petblack.widgets.debug.toggles.show.tooltip',
    size: Sizes.Small,
    atom: debugToggleAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.debug.toggles.show.labelOn',
        labelOff: 'petblack.widgets.debug.toggles.show.labelOff',
    },
};

const debugWorkspaceEntry = debugShowToggleEntry;

export default debugWorkspaceEntry;
