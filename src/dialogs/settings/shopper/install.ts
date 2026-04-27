import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { SECTION, installSection } from '@specfocus/shelly/lib/sections/section-entry';
import { SETTINGS_DIALOG_PATH } from '@specfocus/shelly/lib/settings/settings-dialog-path';
import { SHOPPER, SHOPPER_SETTINGS_SECTION_PATH } from './shopper-settings-section-path';

export { SHOPPER, SHOPPER_SETTINGS_SECTION_PATH };

// TODO: replace with real ShopperSettingsSection component
const ShopperSettingsSection = () => null;
ShopperSettingsSection.displayName = 'ShopperSettingsSection';

const installShopperSettingsSection = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanup = installSection(get, set, SETTINGS_DIALOG_PATH, {
        label: `petblack.dialogs.settings.sections.${SHOPPER}.label`,
        tooltip: `petblack.dialogs.settings.sections.${SHOPPER}.tooltip`,
        resource: {
            '@type': SECTION,
            name: SHOPPER,
            icon: PersonRoundedIcon,
            priority: 60,
            actions: []
        },
        component: ShopperSettingsSection,
    });

    return () => {
        cleanup?.();
    };
};

export default installShopperSettingsSection;
