import { lazy } from 'react';
import { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { DialogKinds } from '@specfocus/shelly/lib/dialogs/dialog-kinds';
import { DialogLayouts } from '@specfocus/shelly/lib/dialogs/dialog-layouts';
import { VIEW } from '@specfocus/shelly/lib/views/view-entry';
import type { WorkspaceViewEntry } from '@specfocus/shelly/lib/views/view-entry';

export const DEBUG_VIEW = 'debug';

const LazyDebugView = lazy(() => import('./debug-view'));

const DebugViewSkeleton = () => null;
DebugViewSkeleton.displayName = 'DebugViewSkeleton';

export const debugViewEntry: WorkspaceViewEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    kind: DialogKinds.View,
    layout: DialogLayouts.Column,
    label: 'petblack.views.debug.label',
    resource: {
        '@type': VIEW,
        name: DEBUG_VIEW,
        data: {},
    },
    primary: LazyDebugView,
    skeleton: DebugViewSkeleton,
};

export default debugViewEntry;
