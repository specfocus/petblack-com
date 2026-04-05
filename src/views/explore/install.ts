import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { SwiperEventTypes } from '@specfocus/shelly/lib/layouts/swiper/machine/swiper-event-types';
import shellActorAtom from '@specfocus/shelly/lib/shell/atoms/shell-actor-atom';
import { installView } from '@specfocus/shelly/lib/views/view-entry';
import { EXPLORE_VIEW, exploreViewEntry, exploreViewContext } from './explore-view-entry';

const installExploreView = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanupView = installView(get, set, EXPLORE_VIEW, exploreViewEntry);

    // Push explore as the initial (base) view in the shell swiper
    set(shellActorAtom, { type: SwiperEventTypes.InitView, view: exploreViewContext });

    return () => {
        cleanupView();
    };
};

export default installExploreView;
