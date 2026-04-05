/**
 * petblack-effect-atom
 *
 * Single mount point for all petblack-specific effect atoms.
 * Mount alongside `shellyInstallEffectAtom` in Bootstrap — kept separate
 * so the two lifecycles remain independent.
 *
 * Bootstrap mounts both:
 *   useAtomValue(shellyInstallEffectAtom);  // shelly built-ins
 *   useAtomValue(petblackEffectAtom);       // petblack additions
 */

import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import atomEffect, { type GetterWithPeek, type SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import installBuddy from '@/widgets/buddy/install';
import installCart from '@/widgets/cart/install';
import installList from '@/widgets/list/install';
import installShopSettingsSection from '@/dialogs/settings/shop/install';
import installShopperSettingsSection from '@/dialogs/settings/shopper/install';
import installPetSettingsSection from '@/dialogs/settings/pet/install';
import installExploreView from '@/views/explore/install';

const petblackEffectAtom: ReadonlyAtom<void> = atomEffect(
    (get: GetterWithPeek, set: SetterWithRecurse) => {
        const cleanupExplore = installExploreView(get, set);
        const cleanupBuddy = installBuddy(get, set);
        const cleanupCart = installCart(get, set);
        const cleanupList = installList(get, set);
        const cleanupShopSettings = installShopSettingsSection(get, set);
        const cleanupShopperSettings = installShopperSettingsSection(get, set);
        const cleanupPetSettings = installPetSettingsSection(get, set);

        return () => {
            cleanupPetSettings();
            cleanupShopperSettings();
            cleanupShopSettings();
            cleanupList();
            cleanupCart();
            cleanupBuddy();
            cleanupExplore();
        };
    }
);

petblackEffectAtom.debugLabel = 'petblackEffectAtom';

export default petblackEffectAtom;
