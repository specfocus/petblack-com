/**
 * widgets/bucket/drilldown/bucket-item-fields
 *
 * FieldDefAtom atoms for BucketItem used by the BucketDrilldown component.
 *
 * Fields:
 *  - sku       → Select (editable, options from PRODUCTS catalogue)
 *  - name      → Text   (readonly, auto-filled when sku changes)
 *  - qty       → Number (editable, right-aligned)
 *  - addedAt   → Date   (readonly)
 */

import atom from '@specfocus/atoms/lib/atom';
import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import type { FieldDef, FieldDefAtom, FieldOption } from '@specfocus/shelly/lib/components/drilldown/drilldown-field';
import type { BucketItem } from '@/domain/types';
import { PRODUCTS } from '@/data/products';

// ── products options atom ────────────────────────────────────────────────────

/**
 * A static (never-changing) ReadonlyAtom that maps the in-memory PRODUCTS
 * catalogue to { value, label } pairs for the SKU select field.
 */
export const productsOptionsAtom: ReadonlyAtom<FieldOption[]> = atom(
    PRODUCTS.map((p): FieldOption => ({
        value: p.sku ?? p['@id'] ?? p.name,
        label: p.name,
    }))
);

// ── field atoms ──────────────────────────────────────────────────────────────

export const skuFieldAtom: FieldDefAtom<BucketItem, 'sku'> = atom<FieldDef<BucketItem, 'sku'>>({
    key: 'sku',
    label: 'SKU',
    inputVariant: 'select',
    editable: true,
    align: 'left',
    optionsAtom: productsOptionsAtom,
});

export const nameFieldAtom: FieldDefAtom<BucketItem, 'name'> = atom<FieldDef<BucketItem, 'name'>>({
    key: 'name',
    label: 'Product',
    inputVariant: 'text',
    editable: false,
    align: 'left',
});

export const qtyFieldAtom: FieldDefAtom<BucketItem, 'qty'> = atom<FieldDef<BucketItem, 'qty'>>({
    key: 'qty',
    label: 'Qty',
    inputVariant: 'number',
    editable: true,
    align: 'right',
});

export const addedAtFieldAtom: FieldDefAtom<BucketItem, 'addedAt'> = atom<FieldDef<BucketItem, 'addedAt'>>({
    key: 'addedAt',
    label: 'Added',
    inputVariant: 'date',
    editable: false,
    align: 'left',
});

/**
 * Field atoms shown in the list table (SKU, name, qty).
 * addedAt is intentionally omitted from the list to keep it compact.
 */
export const bucketItemListFieldsAtoms: [
    FieldDefAtom<BucketItem, 'sku'>,
    FieldDefAtom<BucketItem, 'name'>,
    FieldDefAtom<BucketItem, 'qty'>,
] = [skuFieldAtom, nameFieldAtom, qtyFieldAtom];

/**
 * All field atoms including addedAt — passed to Drilldown's fieldsAtoms so
 * the detail view can show the full record.
 */
export const bucketItemAllFieldsAtoms: [
    FieldDefAtom<BucketItem, 'sku'>,
    FieldDefAtom<BucketItem, 'name'>,
    FieldDefAtom<BucketItem, 'qty'>,
    FieldDefAtom<BucketItem, 'addedAt'>,
] = [skuFieldAtom, nameFieldAtom, qtyFieldAtom, addedAtFieldAtom];
