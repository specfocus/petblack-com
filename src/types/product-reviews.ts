export interface ProductReview {
    id: string;
    author: string;
    title: string;
    body: string;
    rating: number;
    verifiedPurchase: boolean;
    helpfulCount: number;
    reviewDate: string;
    country: string;
}

export interface ProductRatingBreakdown {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}

export interface ProductReviewsResponse {
    sku: string;
    productName: string;
    averageRating: number;
    totalRatings: number;
    highlights: string[];
    ratingBreakdown: ProductRatingBreakdown;
    reviews: ProductReview[];
}
