'use client';

import { type FC } from 'react';
import { useAtomValue } from '@specfocus/atoms/lib/hooks/use-atom-value';
import shellyInstallEffectAtom from '@specfocus/shelly/lib/effects/atoms/install-effect-atom';
import petblackThemeEffectAtom from '@/theme/petblack-theme-effect-atom';

const Bootstrap: FC = () => {
    useAtomValue(shellyInstallEffectAtom);
    useAtomValue(petblackThemeEffectAtom);

    return null;
};

export default Bootstrap;
