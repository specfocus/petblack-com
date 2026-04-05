import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom from '@specfocus/atoms/lib/toggle';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { WorkspaceEntryTypes, Sizes } from '@specfocus/atoms/lib/workspace';
import drugOpenAtom from '../atoms/drug-open-atom';

const drugOpenToggleEntry: ToggleEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    icon: OpenInFullRoundedIcon,
    variant: ToggleVariants.Switch,
    label: 'petblack.widgets.drug.toggles.open.label',
    tooltip: 'petblack.widgets.drug.toggles.open.tooltip',
    size: Sizes.Small,
    atom: drugOpenAtom,
    resource: {
        '@type': 'toggle',
        data: {},
        labelOn: 'petblack.widgets.drug.toggles.open.labelOn',
        labelOff: 'petblack.widgets.drug.toggles.open.labelOff',
    },
};

export default drugOpenToggleEntry;
