/**
 * In-memory search index built from the auto-generated category index files
 * in src/data/indexes/.
 *
 * Each entry is { sku, tags[] }.  We build two lookup structures:
 *   1. skuTags   — Map<sku, Set<tag>>  for per-SKU tag lookup
 *   2. tagSkus   — Map<tag, Set<sku>>  for fast tag → SKU lookup
 *
 * searchProducts(query) splits the query into terms and returns the SKUs
 * whose tag-set contains ALL terms (AND logic).  An empty query returns all
 * SKUs in index order.
 */

import birdAccessory from '@/data/indexes/bird-accessory';
import birdFood from '@/data/indexes/bird-food';
import birdToy from '@/data/indexes/bird-toy';
import catAccessory from '@/data/indexes/cat-accessory';
import catDryFood from '@/data/indexes/cat-dry-food';
import catHealth from '@/data/indexes/cat-health';
import catToy from '@/data/indexes/cat-toy';
import catTreat from '@/data/indexes/cat-treat';
import catWetFood from '@/data/indexes/cat-wet-food';
import dogAccessory from '@/data/indexes/dog-accessory';
import dogDryFood from '@/data/indexes/dog-dry-food';
import dogHealth from '@/data/indexes/dog-health';
import dogToy from '@/data/indexes/dog-toy';
import dogTreat from '@/data/indexes/dog-treat';
import dogWetFood from '@/data/indexes/dog-wet-food';
import farmAnimalFood from '@/data/indexes/farm-animal-food';
import fishAccessory from '@/data/indexes/fish-accessory';
import fishFood from '@/data/indexes/fish-food';
import otherPet from '@/data/indexes/other-pet';
import petGrooming from '@/data/indexes/pet-grooming';
import petHealth from '@/data/indexes/pet-health';
import smallPetAccessory from '@/data/indexes/small-pet-accessory';
import smallPetFood from '@/data/indexes/small-pet-food';
import smallPetToy from '@/data/indexes/small-pet-toy';

// ─── Merge all entries ───────────────────────────────────────────────────────

const ALL_ENTRIES = [
    ...birdAccessory,
    ...birdFood,
    ...birdToy,
    ...catAccessory,
    ...catDryFood,
    ...catHealth,
    ...catToy,
    ...catTreat,
    ...catWetFood,
    ...dogAccessory,
    ...dogDryFood,
    ...dogHealth,
    ...dogToy,
    ...dogTreat,
    ...dogWetFood,
    ...farmAnimalFood,
    ...fishAccessory,
    ...fishFood,
    ...otherPet,
    ...petGrooming,
    ...petHealth,
    ...smallPetAccessory,
    ...smallPetFood,
    ...smallPetToy,
];

// ─── Build lookup maps ───────────────────────────────────────────────────────

/** sku → all tags for that SKU */
const skuTags = new Map<string, Set<string>>();
/** normalised tag token → set of SKUs that have it */
const tagSkus = new Map<string, Set<string>>();
/** insertion-order SKU list (deduped — a SKU may appear in multiple buckets) */
const orderedSkus: string[] = [];

for (const { sku, tags } of ALL_ENTRIES) {
    if (!skuTags.has(sku)) {
        skuTags.set(sku, new Set());
        orderedSkus.push(sku);
    }
    const skuSet = skuTags.get(sku)!;

    for (const rawTag of tags) {
        // Normalise: lowercase, collapse hyphens/underscores to spaces so
        // "dog-dry-food" and "dry food" both match the query "dry food".
        const norm = rawTag.toLowerCase().replace(/[-_]/g, ' ');
        skuSet.add(norm);

        // Also index individual words within multi-word tags
        for (const word of norm.split(/\s+/).filter(Boolean)) {
            skuSet.add(word);
        }

        if (!tagSkus.has(norm)) tagSkus.set(norm, new Set());
        tagSkus.get(norm)!.add(sku);
    }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Total number of indexed products */
export const PRODUCT_COUNT = orderedSkus.length;

/**
 * Search the index and return matching SKUs.
 *
 * @param query  Free-text query string.  Terms are ANDed together.
 * @param limit  Maximum results to return (default 100).
 * @returns      Ordered array of matching SKU strings.
 */
export function searchProducts(query: string, limit = 100): string[] {
    const terms = query
        .trim()
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);

    if (terms.length === 0) {
        return orderedSkus.slice(0, limit);
    }

    const results: string[] = [];
    for (const sku of orderedSkus) {
        if (results.length >= limit) break;
        const tags = skuTags.get(sku)!;
        if (terms.every(t => tags.has(t))) {
            results.push(sku);
        }
    }
    return results;
}
