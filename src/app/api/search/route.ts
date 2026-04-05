import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import type { ProductJsonLd } from '@/types/product-jsonld';

/**
 * GET /api/search?q=<query>
 *
 * In-memory full-text search over the petblack product catalogue.
 * Matches against: name, description, brand.name, keywords (all lowercased).
 *
 * Returns a JSON-LD array: { "@graph": ProductJsonLd[] }
 * An empty query returns all products.
 */
export function GET(request: NextRequest): NextResponse {
    const { searchParams } = request.nextUrl;
    const raw = searchParams.get('q') ?? '';
    const query = raw.trim().toLowerCase();

    let results: ProductJsonLd[];

    if (!query) {
        results = PRODUCTS;
    } else {
        const terms = query.split(/\s+/).filter(Boolean);

        results = PRODUCTS.filter(product => {
            const haystack = [
                product.name,
                product.description,
                product.brand?.name ?? '',
                ...(product.keywords ?? []),
            ]
                .join(' ')
                .toLowerCase();

            // All terms must match (AND logic)
            return terms.every(term => haystack.includes(term));
        });
    }

    return NextResponse.json(
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            query: raw,
            numberOfItems: results.length,
            '@graph': results,
        },
        {
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/ld+json; charset=utf-8',
            },
        }
    );
}
