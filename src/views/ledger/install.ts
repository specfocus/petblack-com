import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { installView } from '@specfocus/shelly/lib/views/view-entry';
import { ledgerViewEntry, LEDGER_VIEW } from './ledger-view-entry';

const installLedgerView = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanupView = installView(get, set, LEDGER_VIEW, ledgerViewEntry);

    return () => {
        cleanupView();
    };
};

export default installLedgerView;
