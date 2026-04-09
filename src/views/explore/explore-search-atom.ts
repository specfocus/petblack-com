import atom from '@specfocus/atoms/lib/atom';

/**
 * Shared search query atom for the Explore view.
 *
 * Written by `ExploreHeader` (rendered in the app bar) and read by
 * `ExploreView` (rendered in the slide body) so both stay in sync without
 * prop-drilling through Shelly's shell layer.
 */
const exploreSearchAtom = atom<string>('');
exploreSearchAtom.debugLabel = 'exploreSearchAtom';

export default exploreSearchAtom;
