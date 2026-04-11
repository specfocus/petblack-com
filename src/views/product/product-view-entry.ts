import { lazy } from 'react';
import type { SimpleObject } from '@specfocus/atoms/lib/record';
import { WorkspaceEntryTypes, type WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { DialogKinds } from '@specfocus/shelly/lib/dialogs/dialog-kinds';
import { DialogLayouts } from '@specfocus/shelly/lib/dialogs/dialog-layouts';
import { VIEW, type WorkspaceViewEntry } from '@specfocus/shelly/lib/views/view-entry';
import { VIEWS_PATH } from '@specfocus/shelly/lib/views/views-path';
import type { ProductJsonLd } from '@/types/product-jsonld';

export const PRODUCT_VIEW = 'product';

const LazyProductView = lazy(() => import('./product-view'));

const ProductViewSkeleton = () => null;
ProductViewSkeleton.displayName = 'ProductViewSkeleton';

/** Swiper stack identity for a product detail slide. */
export const productViewPathForProduct = (product: ProductJsonLd): WorkspacePath => {
    const sku = product.sku ?? product['@id'] ?? product.name;
    return [...VIEWS_PATH, PRODUCT_VIEW, sku];
};

/** Workspace tree path for product JSON resources (unchanged). */
export const getProductWorkspacePath = (product: ProductJsonLd): WorkspacePath => {
    const sku = product.sku ?? product['@id'] ?? product.name;
    return ['products', sku, 'product.json'];
};

export const createProductViewEntry = (product: ProductJsonLd): WorkspaceViewEntry => {
    const sku = product.sku ?? product['@id'] ?? product.name;

    return {
        type: WorkspaceEntryTypes.Ephemeral,
        ephemeral: true,
        kind: DialogKinds.View,
        layout: DialogLayouts.Column,
        label: product.name,
        resource: {
            '@type': VIEW,
            name: PRODUCT_VIEW,
            data: { product: product as unknown as SimpleObject, productSku: sku } as SimpleObject,
        },
        primary: LazyProductView,
        skeleton: ProductViewSkeleton,
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
