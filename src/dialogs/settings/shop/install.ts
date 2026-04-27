import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { SECTION, installSection } from '@specfocus/shelly/lib/sections/section-entry';
import { SETTINGS_DIALOG_PATH } from '@specfocus/shelly/lib/settings/settings-dialog-path';
import ShopSettingsSection from '../sections/shop';
import { SHOP, SHOP_SETTINGS_SECTION_PATH } from './shop-settings-section-path';

export { SHOP, SHOP_SETTINGS_SECTION_PATH };

const installShopSettingsSection = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanup = installSection(get, set, SETTINGS_DIALOG_PATH, {
        label: `petblack.dialogs.settings.sections.${SHOP}.label`,
        tooltip: `petblack.dialogs.settings.sections.${SHOP}.tooltip`,
        resource: {
            '@type': SECTION,
            name: SHOP,
            icon: ShoppingBagRoundedIcon,
            priority: 50,
            actions: []
        },
        component: ShopSettingsSection,
    });

    return () => {
        cleanup?.();
    };
};

export default installShopSettingsSection;
