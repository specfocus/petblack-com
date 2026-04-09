import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { installView } from '@specfocus/shelly/lib/views/view-entry';
import { ViewPriorities, linkView } from '@specfocus/shelly/lib/views/views-entry';
import { PRODUCT_VIEW, productViewEntry } from './product-view-entry';

const installProductView = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanupView = installView(get, set, PRODUCT_VIEW, productViewEntry);

    const cleanupProductDataLink = linkView(get, set, {
        name: PRODUCT_VIEW,
        priority: ViewPriorities.Specific,
        selector: {
            'resource.data': {
                $regex: '"@type"\\s*:\\s*"Product"',
            },
        },
    });

    const cleanupProductFileLink = linkView(get, set, {
        name: PRODUCT_VIEW,
        priority: ViewPriorities.Default,
        selector: {
            'resource.name': {
                $regex: '^product\\.json$|/product\\.json$',
                $flags: 'i',
            },
        },
    });

    return () => {
        cleanupProductFileLink();
        cleanupProductDataLink();
        cleanupView();
    };
};

export default installProductView;
