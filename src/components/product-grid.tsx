'use client';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useAtomValue, useSetAtom, useTranslations } from '@specfocus/atoms/lib/hooks';
import { type FC, useState } from 'react';
import shopActorAtom from '@/atoms/shop-actor-atom';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import { ProductTags, type ProductJsonLd } from '@/types/product-jsonld';

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

// ── Product tag chip ───────────────────────────────────────────────────────────

const TAG_META: Record<string, { label: string; tooltip: string; color: string; bg: string; }> = {
    [ProductTags.InStock]: {
        label: 'In Stock',
        tooltip: 'Available at your selected store',
        color: '#065f46',
        bg: '#d1fae5',
    },
    [ProductTags.Sale]: {
        label: 'Sale',
        tooltip: 'Price reduced',
        color: '#92400e',
        bg: '#fef3c7',
    },
    [ProductTags.Last]: {
        label: 'Last',
        tooltip: 'Very few items left — hurry!',
        color: '#7f1d1d',
        bg: '#fee2e2',
    },
    [ProductTags.OutOfStock]: {
        label: 'Out of Stock',
        tooltip: 'Currently unavailable at your selected store',
        color: '#6b7280',
        bg: 'rgba(255,255,255,0.12)',
    },
    [ProductTags.PreOrder]: {
        label: 'Pre-Order',
        tooltip: 'Not yet released — reserve yours now',
        color: '#1e3a5f',
        bg: '#dbeafe',
    },
};

const ProductTagChip: FC<{ tag: string; }> = ({ tag }) => {
    const meta = TAG_META[tag];
    if (!meta) return null;
    return (
        <Tooltip title={meta.tooltip} arrow placement="top">
            <Chip
                label={meta.label}
                size="small"
                sx={{
                    height: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: meta.bg,
                    color: meta.color,
                    border: 'none',
                    cursor: 'default',
                    '& .MuiChip-label': { px: 1 },
                }}
            />
        </Tooltip>
    );
};

// ── Bucket picker button ───────────────────────────────────────────────────────

/**
 * Split button: left side adds to the currently selected bucket immediately;
 * right chevron opens a menu (anchored upward to the chevron) to switch bucket.
 * The button label and icon always reflect the selected bucket.
 * Labels for prefab buckets come from i18n; custom buckets fall back to their name.
 */
const BucketPickerButton: FC<{ product: ProductJsonLd; disabled?: boolean; }> = ({ product, disabled }) => {
    const t = useTranslations();
    const chevronRef = useState<HTMLElement | null>(null);
    const [chevronEl, setChevronEl] = chevronRef;
    const [menuOpen, setMenuOpen] = useState(false);
    const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
    const [selectedKey, setSelectedKey] = useState<string>('cart');

    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);

    const bucketEntries = Object.entries(buckets);
    const selectedBucket = buckets[selectedKey] ?? buckets['cart'];

    /** Resolve i18n label for a bucket key, falling back to the bucket's own name */
    const getBucketLabel = (key: string): string => {
        const key18n = `petblack.widgets.${key}.addButton` as any;
        const translated = t(key18n);
        // t() returns the key itself when no translation is found
        return translated && translated !== key18n ? translated : selectedBucket?.name ?? key;
    };

    const doAdd = (bucketName: string) => {
        sendShopEvent({
            type: ShopEventTypes.AddItem,
            bucketName,
            sku: product.sku ?? product['@id'] ?? product.name,
            name: product.name,
            qty: 1,
            imageUrl: product.image,
            price: product.offers?.price,
        });
    };

    const handleMainClick = () => doAdd(selectedKey);

    const handleMenuSelect = (key: string) => {
        setSelectedKey(key);
        doAdd(key);
        setMenuOpen(false);
    };

    return (
        // Container: position:relative so the Menu can inherit its width
        <Box ref={setContainerEl} sx={{ width: '100%', position: 'relative' }}>
            {/* Split pill button */}
            <Box
                sx={{
                    display: 'flex',
                    borderRadius: 999,
                    overflow: 'hidden',
                    bgcolor: disabled ? 'action.disabledBackground' : '#FFD814',
                    opacity: disabled ? 0.5 : 1,
                    pointerEvents: disabled ? 'none' : 'auto',
                }}
            >
                {/* Main action — left side */}
                <Box
                    component="button"
                    onClick={handleMainClick}
                    disabled={disabled}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        px: 2,
                        py: '6px',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        color: '#111827',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                        transition: 'background 0.15s',
                    }}
                >
                    <Box component="span" sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
                        {selectedBucket?.icon}
                    </Box>
                    {getBucketLabel(selectedKey)}
                </Box>

                {/* Divider */}
                <Box sx={{ width: '1px', bgcolor: 'rgba(0,0,0,0.15)', my: '6px' }} />

                {/* Chevron — opens the menu */}
                <Box
                    component="button"
                    ref={setChevronEl}
                    onClick={() => setMenuOpen(true)}
                    disabled={disabled}
                    sx={{
                        width: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#111827',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                        transition: 'background 0.15s',
                        flexShrink: 0,
                    }}
                >
                    <ExpandMoreRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
            </Box>

            {/* Menu — anchored to the chevron, opens upward, width = container */}
            <Menu
                anchorEl={chevronEl}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: containerEl?.offsetWidth ?? 'auto',
                            mb: 0.5,
                        },
                    },
                }}
            >
                {bucketEntries.map(([key, bucket]) => (
                    <MenuItem
                        key={key}
                        selected={key === selectedKey}
                        onClick={() => handleMenuSelect(key)}
                        dense
                    >
                        <ListItemIcon sx={{ minWidth: 30, fontSize: '1.1rem' }}>
                            {bucket.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={getBucketLabel(key)}
                            slotProps={{ primary: { style: { fontWeight: key === selectedKey ? 700 : 400 } } }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};


// ── Single product card ────────────────────────────────────────────────────────

const ProductCard: FC<{ product: ProductJsonLd; }> = ({ product }) => {
    const { name, description, image, brand, offers, aggregateRating, keywords = [] } = product;
    const price = offers.price.toFixed(2);
    const [whole, cents] = price.split('.');

    // Derive availability tag from schema.org availability URL
    const availTag =
        offers.availability === 'https://schema.org/InStock' ? ProductTags.InStock :
            offers.availability === 'https://schema.org/OutOfStock' ? ProductTags.OutOfStock :
                ProductTags.PreOrder;

    // Collect chips: availability first, then sale/last from keywords
    const tags = [
        availTag,
        ...keywords.filter(k => k === ProductTags.Sale || k === ProductTags.Last),
    ];

    const isUnavailable = offers.availability === 'https://schema.org/OutOfStock';

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
                    <StarRating value={aggregateRating.ratingValue} count={aggregateRating.reviewCount} />
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

                {/* Price + tags on the same row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {/* Price — Amazon-style superscript cents */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0, mr: 0.5 }}>
                        <Typography variant="caption" fontWeight={700} sx={{ mt: 0.4, lineHeight: 1 }}>$</Typography>
                        <Typography variant="h5" fontWeight={700} lineHeight={1} sx={{ color: '#FFFFFF' }}>{whole}</Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ mt: 0.4, lineHeight: 1 }}>{cents}</Typography>
                    </Box>

                    {/* Tag chips */}
                    {tags.map(tag => <ProductTagChip key={tag} tag={tag} />)}
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
                <BucketPickerButton product={product} disabled={isUnavailable} />
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
