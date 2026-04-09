'use client';

import { useSetAtom } from '@specfocus/atoms/lib/hooks';
import { type FC } from 'react';
import SearchBox from '@/components/search-box';
import exploreSearchAtom from './explore-search-atom';

/**
 * ExploreHeader
 *
 * Rendered inside the Shelly app bar (via ViewContext.header) when the Explore
 * view is active. Writes the submitted query to `exploreSearchAtom`, which
 * ExploreView reads to trigger its product search.
 */
const ExploreHeader: FC = () => {
    const setQuery = useSetAtom(exploreSearchAtom);
    return <SearchBox onSearch={setQuery} size="small" maxWidth={560} />;
};

ExploreHeader.displayName = 'ExploreHeader';

export default ExploreHeader;
