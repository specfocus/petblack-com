import { lazy, createElement, type FC } from 'react';
import { WorkspaceEntryTypes, type WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { DialogKinds } from '@specfocus/shelly/lib/dialogs/dialog-kinds';
import { DialogLayouts } from '@specfocus/shelly/lib/dialogs/dialog-layouts';
import { VIEW } from '@specfocus/shelly/lib/views/view-entry';
import type { WorkspaceViewEntry } from '@specfocus/shelly/lib/views/view-entry';
import type { ViewContext } from '@specfocus/shelly/lib/views/view-context';
import type { ProductJsonLd } from '@/types/product-jsonld';

export const PRODUCT_VIEW = 'product';

const LazyProductView = lazy(() => import('./product-view'));

const ProductViewSkeleton = () => null;
ProductViewSkeleton.displayName = 'ProductViewSkeleton';

const getProductPath = (product: ProductJsonLd): WorkspacePath => {
    const sku = product.sku ?? product['@id'] ?? product.name;
    return ['products', sku, 'product.json'];
};

export const createProductViewContext = (product: ProductJsonLd): ViewContext => {
    const sku = product.sku ?? product['@id'] ?? product.name;

    // Per-instance primary: closes over `product` so the preview card renders
    // the correct product without reading from any global atom.
    const BoundProductView: FC = () => createElement(LazyProductView, { product });
    BoundProductView.displayName = `ProductView:${sku}`;

    return {
        id: `product:${sku}`,
        name: PRODUCT_VIEW,
        label: product.name,
        segment: PRODUCT_VIEW,
        path: getProductPath(product),
        primary: BoundProductView,
        skeleton: ProductViewSkeleton,
        metadata: {
            isProductView: true,
            product,
            productSku: sku,
        },
    };
};

export const productViewEntry: WorkspaceViewEntry = {
    type: WorkspaceEntryTypes.Ephemeral,
    ephemeral: true,
    kind: DialogKinds.View,
    layout: DialogLayouts.Column,
    label: 'petblack.views.product.label',
    resource: {
        '@type': VIEW,
        name: PRODUCT_VIEW,
        data: {},
    },
    primary: LazyProductView,
    skeleton: ProductViewSkeleton,
};

export default productViewEntry;
