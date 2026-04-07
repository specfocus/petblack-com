import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, PRODUCT_COUNT } from '@/data/search-index';
import type { SearchResponse } from '@/types/search-result';

/**
 * GET /api/search?q=<query>[&limit=<n>]
 *
 * Tag-based search over the petblack product index.
 * Query terms are ANDed against the per-SKU tag set built from
 * src/data/indexes/*.ts (auto-generated from datasets4/).
 *
 * Returns only SKUs — the UI fetches metadata from:
 *   /products/<sku>/product.json  (static file in public/products/)
 *
 * Response shape: { query, total, skus: string[] }
 * An empty query returns the first `limit` SKUs across all categories.
 */
export function GET(request: NextRequest): NextResponse<SearchResponse> {
    const { searchParams } = request.nextUrl;
    const raw = searchParams.get('q') ?? '';
    const limit = Math.min(
        parseInt(searchParams.get('limit') ?? '100', 10) || 100,
        500, // hard cap
    );

    const skus = searchProducts(raw, limit);

    const body: SearchResponse = {
        query: raw,
        total: skus.length,
        skus,
    };

    return NextResponse.json(body, {
        headers: {
            // Allow CDN/browser to cache read-only searches for a short time
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Total-Products': String(PRODUCT_COUNT),
        },
    });
}
