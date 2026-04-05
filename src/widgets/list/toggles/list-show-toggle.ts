import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import { LIST_TOGGLE_PATH } from '../list-path';
import listToggleAtom from '../atoms/list-toggle-atom';

export const listShowToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: FormatListBulletedRoundedIcon,
    variant: ToggleVariants.Icon,
    label: 'petblack.widgets.list.toggles.show.label',
    tooltip: 'petblack.widgets.list.toggles.show.tooltip',
    size: Sizes.Small,
    atom: listToggleAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.list.toggles.show.labelOn',
        labelOff: 'petblack.widgets.list.toggles.show.labelOff',
    },
};

export const listWorkspaceEntry = listShowToggleEntry;
export { LIST_TOGGLE_PATH };
export default listWorkspaceEntry;
