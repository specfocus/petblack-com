'use client';

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { type FC } from 'react';
import type { ProductJsonLd } from '@/types/product-jsonld';

// ── Star rating helper ─────────────────────────────────────────────────────────

const StarRating: FC<{ value: number; count?: number; }> = ({ value, count }) => {
    const stars = Array.from({ length: 5 }, (_, i) => {
        const filled = value >= i + 1;
        const half = !filled && value >= i + 0.5;
        const Icon = filled ? StarRoundedIcon : half ? StarHalfRoundedIcon : StarBorderRoundedIcon;
        return <Icon key={i} sx={{ fontSize: 18, color: '#FFA41C' }} />;
    });
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            {stars}
            {count !== undefined && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({count.toLocaleString()})
                </Typography>
            )}
        </Box>
    );
};

// ── Single product card ────────────────────────────────────────────────────────

const ProductCard: FC<{ product: ProductJsonLd; }> = ({ product }) => {
    const { name, description, image, brand, offers, aggregateRating } = product;
    const price = offers.price.toFixed(2);
    const [whole, cents] = price.split('.');

    return (
        <Card
            elevation={1}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                transition: 'background-color 0.2s, box-shadow 0.2s',
                '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                },
            }}
        >
            {/* Product image */}
            <CardMedia
                component="img"
                image={image}
                alt={name}
                sx={{
                    height: 200,
                    objectFit: 'contain',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    p: 1.5,
                }}
            />

            <CardContent sx={{ flexGrow: 1, pb: 0.5 }}>
                {/* Brand */}
                {brand && (
                    <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                    >
                        {brand.name}
                    </Typography>
                )}

                {/* Title */}
                <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                        color: '#F3F4F6',
                        mt: 0.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4,
                    }}
                    title={name}
                >
                    {name}
                </Typography>

                {/* Stars */}
                {aggregateRating && (
                    <StarRating
                        value={aggregateRating.ratingValue}
                        count={aggregateRating.reviewCount}
                    />
                )}

                {/* Description */}
                <Typography
                    variant="caption"
                    sx={{
                        color: 'rgba(255,255,255,0.64)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mt: 0.75,
                        lineHeight: 1.4,
                    }}
                >
                    {description}
                </Typography>

                <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.12)' }} />

                {/* Price — Amazon-style superscript cents */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                    <Typography variant="caption" fontWeight={700} sx={{ mt: 0.4, lineHeight: 1 }}>
                        $
                    </Typography>
                    <Typography variant="h5" fontWeight={700} lineHeight={1} sx={{ color: '#FFFFFF' }}>
                        {whole}
                    </Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ mt: 0.4, lineHeight: 1 }}>
                        {cents}
                    </Typography>
                </Box>

                {/* Stock badge */}
                <Chip
                    label={
                        offers.availability === 'https://schema.org/InStock'
                            ? 'In Stock'
                            : offers.availability === 'https://schema.org/OutOfStock'
                                ? 'Out of Stock'
                                : 'Pre-Order'
                    }
                    color={
                        offers.availability === 'https://schema.org/InStock'
                            ? 'success'
                            : offers.availability === 'https://schema.org/OutOfStock'
                                ? 'error'
                                : 'warning'
                    }
                    size="small"
                    sx={{ mt: 0.75, height: 20, fontSize: 11 }}
                />
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    startIcon={<AddShoppingCartRoundedIcon />}
                    disabled={offers.availability === 'https://schema.org/OutOfStock'}
                    sx={{
                        borderRadius: 999,
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: '#FFD814',
                        color: '#111827',
                        '&:hover': { bgcolor: '#F7CA00' },
                    }}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
};

// ── Loading skeleton ───────────────────────────────────────────────────────────

const ProductCardSkeleton: FC = () => (
    <Card
        elevation={1}
        sx={{ borderRadius: 0, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
        <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
        <CardContent>
            <Skeleton width="40%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton height={20} sx={{ mt: 0.5, bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton width="60%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton width="80%" height={14} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton width="60%" height={14} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton width="30%" height={32} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
            <Skeleton variant="rectangular" height={32} width="100%" sx={{ borderRadius: 999, bgcolor: 'rgba(255,255,255,0.12)' }} />
        </CardActions>
    </Card>
);

// ── Grid ───────────────────────────────────────────────────────────────────────

interface ProductGridProps {
    products: ProductJsonLd[];
    loading?: boolean;
    query?: string;
}

const ProductGrid: FC<ProductGridProps> = ({ products, loading = false, query }) => {
    if (loading) {
        return (
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                        <ProductCardSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (products.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#E5E7EB' }}>
                    No results for &ldquo;{query}&rdquo;
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.6)' }}>
                    Try a different search term — e.g. &ldquo;dog food&rdquo;, &ldquo;cat toy&rdquo;, &ldquo;fish&rdquo;.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: 'rgba(255,255,255,0.72)' }}>
                {products.length.toLocaleString()} result{products.length !== 1 ? 's' : ''}
                {query ? ` for "${query}"` : ''}
            </Typography>
            <Grid container spacing={2}>
                {products.map(product => (
                    <Grid key={product['@id'] ?? product.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ProductGrid;
