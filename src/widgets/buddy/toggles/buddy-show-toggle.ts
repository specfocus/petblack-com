import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import { BUDDY_WIDGET_PATH } from '../buddy-widget-path';
import buddyToggleAtom from '../atoms/buddy-toggle-atom';

export const BUDDY_TOGGLE_PATH = [...BUDDY_WIDGET_PATH, 'toggles', 'show'];

export const buddyShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: PetsRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.buddy.toggles.show.label',
    tooltip: 'petblack.widgets.buddy.toggles.show.tooltip',
    size: Sizes.Small,
    atom: buddyToggleAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.buddy.toggles.show.labelOn',
        labelOff: 'petblack.widgets.buddy.toggles.show.labelOff',
    },
};

export const buddyWorkspaceEntry = buddyShowToggleEntry;

export default buddyWorkspaceEntry;
