import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { SECTION, installSection } from '@specfocus/shelly/lib/sections/section-entry';
import { SETTINGS_DIALOG_PATH } from '@specfocus/shelly/lib/settings/settings-dialog-path';
import { PET, PET_SETTINGS_SECTION_PATH } from './pet-settings-section-path';

export { PET, PET_SETTINGS_SECTION_PATH };

// TODO: replace with real PetSettingsSection component
const PetSettingsSection = () => null;
PetSettingsSection.displayName = 'PetSettingsSection';

const installPetSettingsSection = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanup = installSection(get, set, SETTINGS_DIALOG_PATH, {
        label: `petblack.dialogs.settings.sections.${PET}.label`,
        tooltip: `petblack.dialogs.settings.sections.${PET}.tooltip`,
        resource: {
            '@type': SECTION,
            name: PET,
            icon: PetsRoundedIcon,
            priority: 40,
            actions: []
        },
        component: PetSettingsSection,
    });

    return () => {
        cleanup?.();
    };
};

export default installPetSettingsSection;
