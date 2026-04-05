'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchBox from '@/components/search-box';
import ProductGrid from '@/components/product-grid';
import type { ProductJsonLd } from '@/types/product-jsonld';
import { useState, useCallback, useEffect, type FC } from 'react';

const HomeSection: FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ProductJsonLd[] | null>(null);
    const [loading, setLoading] = useState(false);

    const hasResults = results !== null;

    // Toggle data-results on body instead of swapping classNames
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
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
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
            {/* Search bar */}
            <Box
                component="header"
                sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: hasResults ? 'background.paper' : 'transparent',
                    borderBottom: hasResults ? 1 : 0,
                    borderColor: 'divider',
                    transition: 'background-color 0.3s',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <SearchBox onSearch={handleSearch} loading={loading} />
            </Box>

            {/* Results */}
            {hasResults ? (
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <ProductGrid products={results} loading={loading} query={query} />
                </Container>
            ) : (
                /* Hero spacer — background comes from CSS on #petblack-shell */
                <Box sx={{ flexGrow: 1 }} />
            )}
        </>
    );
};

HomeSection.displayName = 'HomeSection';

export default HomeSection;
