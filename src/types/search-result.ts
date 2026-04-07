/**
 * Shape returned by GET /api/search?q=<query>
 *
 * The API returns only SKUs. The UI fetches individual product metadata from
 * /products/<sku>/product.json (served statically from public/products/).
 */
export interface SearchResponse {
    /** Original query string as submitted */
    query: string;
    /** Total number of matching SKUs */
    total: number;
    /** Ordered list of matching SKU strings */
    skus: string[];
}
