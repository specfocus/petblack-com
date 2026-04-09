'use client';

import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { type FC, useEffect, useMemo, useState } from 'react';
import ProductReview from './product-review';
import type { ProductReviewsResponse } from '@/types/product-reviews';

export interface ProductReviewsProps {
    sku: string;
    productName: string;
    ratingHint?: number;
}

const ReviewsSkeleton: FC = () => (
    <Stack spacing={2}>
        <Skeleton variant="text" width={260} height={38} />
        <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
    </Stack>
);

const ProductReviews: FC<ProductReviewsProps> = ({ sku, productName, ratingHint }) => {
    const [data, setData] = useState<ProductReviewsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = new URL(`/api/products/${encodeURIComponent(sku)}/reviews`, window.location.origin);
                url.searchParams.set('name', productName);
                if (typeof ratingHint === 'number' && Number.isFinite(ratingHint)) {
                    url.searchParams.set('rating', String(ratingHint));
                }

                const response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json() as ProductReviewsResponse;
                if (!cancelled) {
                    setData(payload);
                }
            } catch {
                if (!cancelled) {
                    setError('Unable to load customer reviews right now.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [productName, ratingHint, sku]);

    const percentages = useMemo(() => {
        if (!data || data.totalRatings <= 0) {
            return {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            } as const;
        }

        return {
            5: (data.ratingBreakdown[5] / data.totalRatings) * 100,
            4: (data.ratingBreakdown[4] / data.totalRatings) * 100,
            3: (data.ratingBreakdown[3] / data.totalRatings) * 100,
            2: (data.ratingBreakdown[2] / data.totalRatings) * 100,
            1: (data.ratingBreakdown[1] / data.totalRatings) * 100,
        } as const;
    }, [data]);

    if (loading) {
        return <ReviewsSkeleton />;
    }

    if (error || !data) {
        return <Alert severity="warning">{error ?? 'Unable to load reviews.'}</Alert>;
    }

    return (
        <Stack spacing={2.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Customer reviews
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Card variant="outlined" sx={{ minWidth: { md: 280 }, flexShrink: 0 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Rating readOnly precision={0.1} value={data.averageRating} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {data.averageRating.toFixed(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                out of 5
                            </Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                            {data.totalRatings.toLocaleString()} global ratings
                        </Typography>

                        {[5, 4, 3, 2, 1].map(stars => (
                            <Stack key={stars} direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                                <Typography variant="caption" sx={{ width: 38 }}>{stars} star</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={percentages[stars as 1 | 2 | 3 | 4 | 5]}
                                    sx={{
                                        flex: 1,
                                        height: 9,
                                        borderRadius: 999,
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                        '& .MuiLinearProgress-bar': { bgcolor: '#ff9900' },
                                    }}
                                />
                                <Typography variant="caption" sx={{ width: 38, textAlign: 'right' }}>
                                    {Math.round(percentages[stars as 1 | 2 | 3 | 4 | 5])}%
                                </Typography>
                            </Stack>
                        ))}
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            Customers say
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Generated sample sentiment based on recent ratings for {data.productName}.
                        </Typography>
                        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                            {data.highlights.map(tag => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>

            <Divider />

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Top reviews from the United States
            </Typography>

            <Stack spacing={1.5}>
                {data.reviews.map(review => (
                    <ProductReview key={review.id} review={review} />
                ))}
            </Stack>
        </Stack>
    );
};

ProductReviews.displayName = 'ProductReviews';

export default ProductReviews;
