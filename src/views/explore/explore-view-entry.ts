import { lazy } from 'react';
import { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { DialogKinds } from '@specfocus/shelly/lib/dialogs/dialog-kinds';
import { DialogLayouts } from '@specfocus/shelly/lib/dialogs/dialog-layouts';
import { VIEW } from '@specfocus/shelly/lib/views/view-entry';
import type { WorkspaceViewEntry } from '@specfocus/shelly/lib/views/view-entry';
import ExploreHeader from './explore-header';

export const EXPLORE_VIEW = 'explore';

const LazyExploreView = lazy(() => import('./explore-view'));

// Skeleton — simple black fill while the view chunk loads
const ExploreViewSkeleton = () => null;
ExploreViewSkeleton.displayName = 'ExploreViewSkeleton';

export const exploreViewEntry: WorkspaceViewEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    kind: DialogKinds.View,
    layout: DialogLayouts.Column,
    label: 'petblack.views.explore.label',
    resource: {
        '@type': VIEW,
        name: EXPLORE_VIEW
    },
    primary: LazyExploreView,
    skeleton: ExploreViewSkeleton,
    header: ExploreHeader,
};

export default exploreViewEntry;
