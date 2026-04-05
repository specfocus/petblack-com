'use client';

import petblackEffectAtom from '@/atoms/petblack-effect-atom';
import petblackThemeEffectAtom from '@/theme/petblack-theme-effect-atom';
import { useAtomValue } from '@specfocus/atoms/lib/hooks/use-atom-value';
import shellyInstallEffectAtom from '@specfocus/shelly/lib/effects/atoms/install-effect-atom';
import { type FC } from 'react';

const Bootstrap: FC = () => {
    useAtomValue(shellyInstallEffectAtom);
    useAtomValue(petblackEffectAtom);
    useAtomValue(petblackThemeEffectAtom);

    return null;
};

export default Bootstrap;
