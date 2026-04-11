'use client';

import Box from '@mui/material/Box';
import ProductGrid from '@/components/product-grid';
import type { ProductJsonLd } from '@/types/product-jsonld';
import { useAtomValue } from '@specfocus/atoms/lib/hooks';
import { useState, useEffect, type FC } from 'react';
import exploreSearchAtom from './explore-search-atom';

const ExploreView: FC = () => {
    const query = useAtomValue(exploreSearchAtom);
    const [results, setResults] = useState<ProductJsonLd[] | null>(null);
    const [loading, setLoading] = useState(false);

    const hasResults = results !== null;

    useEffect(() => {
        if (hasResults) {
            document.body.setAttribute('data-results', '');
        } else {
            document.body.removeAttribute('data-results');
        }
        return () => document.body.removeAttribute('data-results');
    }, [hasResults]);

    useEffect(() => {
        if (!query) {
            setResults(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setResults([]);  // show grid immediately so layout is ready

        (async () => {
            try {
                const res = await fetch('/api/search?q=' + encodeURIComponent(query) + '&limit=48');
                const { skus } = await res.json() as { skus: string[]; };

                // Fetch product metadata in small batches and stream results into
                // state as each batch completes, so cards appear progressively.
                const BATCH = 6;
                for (let i = 0;i < skus.length;i += BATCH) {
                    if (cancelled) break;
                    const batch = skus.slice(i, i + BATCH);
                    const settled = await Promise.allSettled(
                        batch.map(sku =>
                            fetch(`/products/${sku}/product.json`)
                                .then(r => {
                                    if (!r.ok) throw new Error(`${r.status}`);
                                    return r.json();
                                })
                                .then((p: ProductJsonLd & { sku?: string; }) => {
                                    // Resolve bare filename images to their public path
                                    if (p.image && !p.image.startsWith('http') && !p.image.startsWith('/')) {
                                        p.image = `/products/${sku}/${p.image}`;
                                    }
                                    return p;
                                })
                        )
                    );
                    const good = settled
                        .filter((r): r is PromiseFulfilledResult<ProductJsonLd> => r.status === 'fulfilled')
                        .map(r => r.value);
                    if (!cancelled && good.length > 0) {
                        setResults(prev => [...(prev ?? []), ...good]);
                    }
                }
            } catch {
                if (!cancelled) setResults([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [query]);

    return (
        <Box
            sx={{
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {hasResults ? (
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarGutter: 'stable',
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 2, sm: 3 },
                        py: 3,
                        maxWidth: {
                            xs: '100%',
                            sm: '100%',
                            md: '100%',
                            lg: '100%',
                            xl: '60vw',
                        },
                    }}
                >
                    <ProductGrid products={results} loading={loading} query={query} />
                </Box>
            ) : (
                <Box sx={{ flex: 1, minHeight: 0 }} />
            )}
        </Box>
    );
};

ExploreView.displayName = 'ExploreView';

export default ExploreView;
