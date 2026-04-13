import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { SwiperEventTypes } from '@specfocus/shelly/lib/layouts/swiper/machine/swiper-event-types';
import shellActorAtom from '@specfocus/shelly/lib/shell/atoms/shell-actor-atom';
import { VIEWS_PATH } from '@specfocus/shelly/lib/views/views-path';
import { installView } from '@specfocus/shelly/lib/views/view-entry';
import { exploreViewEntry, EXPLORE_VIEW } from './explore-view-entry';

const installExploreView = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanupView = installView(get, set, EXPLORE_VIEW, exploreViewEntry);

    // Push explore as the initial (base) view in the shell swiper
    set(shellActorAtom, {
        type: SwiperEventTypes.InitView,
        view: exploreViewEntry,
        viewPath: [...VIEWS_PATH, EXPLORE_VIEW],
    });

    return () => {
        cleanupView();
    };
};

export default installExploreView;
