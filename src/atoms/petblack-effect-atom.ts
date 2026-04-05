/**
 * petblack-effect-atom
 *
 * Single mount point for all petblack-specific effect atoms.
 * Mount alongside `<ShellyBootstrap />` in Bootstrap — kept separate
 * so the two lifecycles remain independent.
 *
 * Bootstrap mounts both:
 *   <ShellyBootstrap />                     // shelly built-ins + reactive effects
 *   useAtomValue(petblackEffectAtom);       // petblack additions
 */

import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import atomEffect, { type GetterWithPeek, type SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { installFeedbackActor } from '@specfocus/shelly/lib/machines/feedback';
import installBuddy from '@/widgets/buddy/install';
import installCart from '@/widgets/cart/install';
import installBuckets from '@/widgets/bucket/install';
import installShopSettingsSection from '@/dialogs/settings/shop/install';
import installShopperSettingsSection from '@/dialogs/settings/shopper/install';
import installPetSettingsSection from '@/dialogs/settings/pet/install';
import installExploreView from '@/views/explore/install';
import shopActorAtom from './shop-actor-atom';
import installDebug from '@/widgets/debug/install';

const petblackEffectAtom: ReadonlyAtom<void> = atomEffect(
    (get: GetterWithPeek, set: SetterWithRecurse) => {
        const cleanupExplore = installExploreView(get, set);
        const cleanupBuddy = installBuddy(get, set);
        const cleanupCart = installCart(get, set);
        const cleanupBuckets = installBuckets(get, set);
        const cleanupDebug = installDebug(get, set);
        const cleanupShopSettings = installShopSettingsSection(get, set);
        const cleanupShopperSettings = installShopperSettingsSection(get, set);
        const cleanupPetSettings = installPetSettingsSection(get, set);
        const cleanupFeedback = installFeedbackActor(get, set, shopActorAtom, 'shop', 'Shop Actor');

        return () => {
            cleanupFeedback();
            cleanupPetSettings();
            cleanupShopperSettings();
            cleanupShopSettings();
            cleanupBuckets();
            cleanupDebug();
            cleanupCart();
            cleanupBuddy();
            cleanupExplore();
        };
    }
);

petblackEffectAtom.debugLabel = 'petblackEffectAtom';

export default petblackEffectAtom;
