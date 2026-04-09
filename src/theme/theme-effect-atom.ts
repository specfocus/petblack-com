import atomEffect from '@specfocus/atoms/lib/effect';
import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import type { GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import componentThemesAtom, { type ComponentThemeEntry } from '@specfocus/shelly/lib/theme/component-themes-atom';
import activeBaseThemeAtom from '@specfocus/shelly/lib/theme/active-base-theme-atom';
import { petblackDark, petblackLight } from './petblack-theme';
import { BaseThemeNames } from '@specfocus/shelly/lib/theme/index';

const ID = 'petblack';

const themeEffectAtom: ReadonlyAtom<void> = atomEffect(
    (get: GetterWithPeek, set: SetterWithRecurse) => {
        const base = get(activeBaseThemeAtom);
        const options = base === BaseThemeNames.Light ? petblackLight : petblackDark;
        set(componentThemesAtom, (prev: ComponentThemeEntry[]) => [
            ...prev.filter((e: ComponentThemeEntry) => e.id !== ID),
            { id: ID, options },
        ]);
        return () => {
            set(componentThemesAtom, (prev: ComponentThemeEntry[]) =>
                prev.filter((e: ComponentThemeEntry) => e.id !== ID)
            );
        };
    }
);

themeEffectAtom.debugLabel = 'themeEffectAtom';

export default themeEffectAtom;
