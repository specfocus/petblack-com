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
import { translationsAtom } from '@specfocus/atoms/lib/i18n';
import installBuddy from '@/widgets/buddy/install';
import installCart from '@/widgets/cart/install';
import installAuto from '@/widgets/auto/install';
import installDiet from '@/widgets/diet/install';
import installDrug from '@/widgets/drug/install';
import installPick from '@/widgets/pick/install';
import installBuckets from '@/widgets/bucket/install';
import installShopSettingsSection from '@/dialogs/settings/shop/install';
import installShopperSettingsSection from '@/dialogs/settings/shopper/install';
import installPetSettingsSection from '@/dialogs/settings/pet/install';
import installExploreView from '@/views/explore/install';
import installProductView from '@/views/product/install';
import shopActorAtom from './shop-actor-atom';
import installDebug from '@/widgets/debug/install';

const installEffectAtom: ReadonlyAtom<void> = atomEffect(
    (get: GetterWithPeek, set: SetterWithRecurse) => {
        // Register petblack translations
        set(translationsAtom, (draft: [string, Promise<Record<string, unknown>>][]) => [
            ...draft,
            ['en', import('../i18n/en').then(m => m.default)],
        ]);

        const cleanupExplore = installExploreView(get, set);
        const cleanupProductView = installProductView(get, set);
        const cleanupBuddy = installBuddy(get, set);
        const cleanupCart = installCart(get, set);
        const cleanupAuto = installAuto(get, set);
        const cleanupDiet = installDiet(get, set);
        const cleanupDrug = installDrug(get, set);
        const cleanupPick = installPick(get, set);
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
            cleanupPick();
            cleanupDrug();
            cleanupDiet();
            cleanupAuto();
            cleanupCart();
            cleanupBuddy();
            cleanupProductView();
            cleanupExplore();
        };
    }
);

installEffectAtom.debugLabel = 'petblackEffectAtom';

export default installEffectAtom;
