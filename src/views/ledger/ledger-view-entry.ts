import { lazy } from 'react';
import { WorkspaceEntryTypes } from '@specfocus/atoms/lib/workspace';
import { DialogKinds } from '@specfocus/shelly/lib/dialogs/dialog-kinds';
import { DialogLayouts } from '@specfocus/shelly/lib/dialogs/dialog-layouts';
import { VIEW } from '@specfocus/shelly/lib/views/view-entry';
import type { WorkspaceViewEntry } from '@specfocus/shelly/lib/views/view-entry';

export const LEDGER_VIEW = 'ledger';

const LazyLedgerView = lazy(() => import('./ledger-view'));

const LedgerViewSkeleton = () => null;
LedgerViewSkeleton.displayName = 'LedgerViewSkeleton';

export const ledgerViewEntry: WorkspaceViewEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    kind: DialogKinds.View,
    layout: DialogLayouts.Column,
    label: 'petblack.views.ledger.label',
    resource: {
        '@type': VIEW,
        name: LEDGER_VIEW
    },
    primary: LazyLedgerView,
    skeleton: LedgerViewSkeleton,
};

export default ledgerViewEntry;
