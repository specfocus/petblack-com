import atomEffect from '@specfocus/atoms/lib/effect';
import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import type { GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import componentThemesAtom, {
    type ComponentThemeEntry,
} from '@specfocus/shelly/lib/theme/component-themes-atom';
import activeBaseThemeAtom from '@specfocus/shelly/lib/theme/active-base-theme-atom';
import { petblackDark, petblackLight } from './petblack-theme';
import { BaseThemeNames } from '@specfocus/shelly/lib/theme/index';

const ID = 'petblack';

/**
 * petblackThemeEffectAtom
 *
 * Registers the petblack palette as a `componentThemesAtom` slice so that
 * shelly's `shellyThemeAtom` merges it on top of the active base theme.
 *
 * Mount once via `useAtomValue(petblackThemeEffectAtom)` — ideally inside
 * the app's Bootstrap component.
 */
const petblackThemeEffectAtom: ReadonlyAtom<void> = atomEffect(
    (get: GetterWithPeek, set: SetterWithRecurse) => {
        // Resolve which mode is active so we can pick the matching palette.
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

petblackThemeEffectAtom.debugLabel = 'petblackThemeEffectAtom';

export default petblackThemeEffectAtom;
