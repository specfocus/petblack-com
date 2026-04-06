/**
 * Minimal schema.org/Product JSON-LD representation used by the petblack
 * in-memory search engine.
 *
 * Spec: https://schema.org/Product
 */

export interface ProductOffer {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder';
    url?: string;
}

export interface AggregateRating {
    '@type': 'AggregateRating';
    ratingValue: number;   // 1–5
    reviewCount: number;
}

export interface Brand {
    '@type': 'Brand';
    name: string;
}

/**
 * Well-known product tag values rendered as coloured chips on the card.
 * Any other keyword is treated as a plain filter tag and not rendered as a chip.
 */
export enum ProductTags {
    InStock = 'in-stock',
    OutOfStock = 'out-of-stock',
    PreOrder = 'pre-order',
    Sale = 'sale',
    Last = 'last',
}

export interface ProductJsonLd {
    '@context': 'https://schema.org';
    '@type': 'Product';
    '@id'?: string;
    name: string;
    description: string;
    image: string;
    sku?: string;
    brand?: Brand;
    offers: ProductOffer;
    aggregateRating?: AggregateRating;
    /** Free-form tags for search filtering (not in spec but useful internally) */
    keywords?: string[];
}
