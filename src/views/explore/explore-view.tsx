'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchBox from '@/components/search-box';
import ProductGrid from '@/components/product-grid';
import type { ProductJsonLd } from '@/types/product-jsonld';
import { useState, useCallback, useEffect, type FC } from 'react';

const ExploreView: FC = () => {
    const [query, setQuery] = useState('');
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

    const handleSearch = useCallback(async (q: string) => {
        setQuery(q);
        if (!q) {
            setResults(null);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/search?q=' + encodeURIComponent(q));
            const data = await res.json();
            setResults(data['@graph'] ?? []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <>
            <Box
                component="header"
                sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: 'transparent',
                    borderBottom: 0,
                    transition: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <SearchBox onSearch={handleSearch} loading={loading} />
            </Box>

            {hasResults ? (
                <Box
                    sx={{
                        // On screens ≥ 1920 px (xl) the content sits in the
                        // centre 3/5 of the viewport — 1/5 margin on each side.
                        // Below that it behaves like a normal xl Container.
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 2, sm: 3 },
                        py: 3,
                        maxWidth: {
                            xs: '100%',
                            sm: '100%',
                            md: '100%',
                            lg: '100%',
                            xl: '60vw',   // 3/5 of the viewport width
                        },
                    }}
                >
                    <ProductGrid products={results} loading={loading} query={query} />
                </Box>
            ) : (
                <Box sx={{ flexGrow: 1 }} />
            )}
        </>
    );
};

ExploreView.displayName = 'ExploreView';

export default ExploreView;
