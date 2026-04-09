'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import type { ProductReview as ProductReviewModel } from '@/types/product-reviews';

export interface ProductReviewProps {
    review: ProductReviewModel;
}

const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
        ? iso
        : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const ProductReview: FC<ProductReviewProps> = ({ review }) => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {review.author}
                    </Typography>
                    {review.verifiedPurchase && (
                        <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>
                            Verified Purchase
                        </Typography>
                    )}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Rating readOnly value={review.rating} precision={0.5} size="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {review.title}
                    </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Reviewed in the {review.country} on {formatDate(review.reviewDate)}
                </Typography>

                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {review.body}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.25 }}>
                    {review.helpfulCount.toLocaleString()} people found this helpful
                </Typography>
            </CardContent>
        </Card>
    );
};

ProductReview.displayName = 'ProductReview';

export default ProductReview;
