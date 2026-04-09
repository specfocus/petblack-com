'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import { useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import activeViewAtom from '@specfocus/shelly/lib/shell/atoms/swiper/active-view-atom';
import popViewAtom from '@specfocus/shelly/lib/shell/atoms/swiper/pop-view-atom';
import activeWorkspaceEntryResourceObjectAtom from '@specfocus/shelly/lib/workspace/atoms/active-workspace-entry-resource-object-atom';
import { type FC, useMemo } from 'react';
import ProductReviews from '@/components/product/product-reviews';
import type { ProductJsonLd } from '@/types/product-jsonld';

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

const isProductJsonLd = (value: unknown): value is ProductJsonLd => {
    if (!isRecord(value)) return false;

    const offers = value.offers;
    return (
        value['@type'] === 'Product' &&
        typeof value.name === 'string' &&
        typeof value.description === 'string' &&
        typeof value.image === 'string' &&
        isRecord(offers) &&
        typeof offers.price === 'number' &&
        typeof offers.priceCurrency === 'string' &&
        typeof offers.availability === 'string'
    );
};

const resolveImage = (product: ProductJsonLd): string => {
    if (!product.image) return '';
    if (product.image.startsWith('http') || product.image.startsWith('/')) return product.image;

    const sku = product.sku ?? product['@id'];
    if (!sku) return product.image;

    return `/products/${sku}/${product.image}`;
};

const availabilityLabel = (availability: ProductJsonLd['offers']['availability']): string => {
    if (availability === 'https://schema.org/InStock') return 'In stock';
    if (availability === 'https://schema.org/OutOfStock') return 'Out of stock';
    return 'Pre-order';
};

const availabilityColor = (availability: ProductJsonLd['offers']['availability']): 'success' | 'warning' | 'default' => {
    if (availability === 'https://schema.org/InStock') return 'success';
    if (availability === 'https://schema.org/PreOrder') return 'warning';
    return 'default';
};

const ProductView: FC = () => {
    const activeView = useAtomValue(activeViewAtom);
    const popView = useSetAtom(popViewAtom);
    const activeResourceObject = useAtomValue(activeWorkspaceEntryResourceObjectAtom);

    const metadataProduct = activeView?.metadata?.product;
    const product = useMemo(() => {
        if (isProductJsonLd(metadataProduct)) return metadataProduct;
        if (isProductJsonLd(activeResourceObject)) return activeResourceObject;
        return null;
    }, [activeResourceObject, metadataProduct]);

    if (!product) {
        return (
            <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Product details unavailable
                </Typography>
                <Typography color="text.secondary">
                    Select a `product.json` workspace entry or open a product from Explore.
                </Typography>
            </Box>
        );
    }

    const image = resolveImage(product);
    const sku = product.sku ?? product['@id'] ?? product.name;
    const priceText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.offers.priceCurrency || 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(product.offers.price);

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1380, mx: 'auto' }}>
            <Grid container spacing={3} alignItems="flex-start">
                <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: 'rgba(255,255,255,0.02)',
                        }}
                    >
                        <Box
                            component="img"
                            src={image}
                            alt={product.name}
                            sx={{
                                width: '100%',
                                maxHeight: 620,
                                objectFit: 'contain',
                                bgcolor: 'rgba(255,255,255,0.03)',
                                p: 2,
                            }}
                        />
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 7, lg: 5 }}>
                    <Stack spacing={2.5} sx={{ width: '100%' }}>
                        <Box>
                            {product.brand?.name && (
                                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
                                    {product.brand.name}
                                </Typography>
                            )}
                            <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                                {product.name}
                            </Typography>

                            {product.aggregateRating && (
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                    <Rating
                                        readOnly
                                        precision={0.1}
                                        value={Math.max(0, Math.min(5, product.aggregateRating.ratingValue))}
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {product.aggregateRating.ratingValue.toFixed(1)} ({product.aggregateRating.reviewCount.toLocaleString()} ratings)
                                    </Typography>
                                </Stack>
                            )}
                        </Box>

                        <Divider />

                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {product.description}
                        </Typography>

                        {product.keywords && product.keywords.length > 0 && (
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                {product.keywords.slice(0, 12).map(keyword => (
                                    <Chip key={keyword} label={keyword} size="small" />
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>
                    <Stack spacing={1.5}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                position: { lg: 'sticky' },
                                top: { lg: 20 },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {priceText}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {product.offers.priceCurrency} · SKU {sku}
                                </Typography>

                                <Chip
                                    label={availabilityLabel(product.offers.availability)}
                                    color={availabilityColor(product.offers.availability)}
                                    size="small"
                                    sx={{ mt: 1.5 }}
                                />

                                <Stack spacing={1.25} sx={{ mt: 2 }}>
                                    <Button variant="contained" size="large" disabled={product.offers.availability === 'https://schema.org/OutOfStock'}>
                                        Add to cart
                                    </Button>
                                    <Button variant="outlined" size="large">
                                        Add to wishlist
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Button variant="text" color="inherit" size="small" onClick={popView} disabled={!activeView}>
                            Close view
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <ProductReviews
                    sku={sku}
                    productName={product.name}
                    ratingHint={product.aggregateRating?.ratingValue}
                />
            </Box>
        </Box>
    );
};

ProductView.displayName = 'ProductView';

export default ProductView;
