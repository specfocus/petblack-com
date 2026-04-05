'use client';

import petblackEffectAtom from '@/atoms/petblack-effect-atom';
import petblackThemeEffectAtom from '@/theme/petblack-theme-effect-atom';
import { useAtomValue } from '@specfocus/atoms/lib/hooks/use-atom-value';
import shellyInstallEffectAtom from '@specfocus/shelly/lib/effects/atoms/install-effect-atom';
import { type FC } from 'react';
import storageActorAtom from '@/atoms/storage-actor-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import agentActorAtom from '@/atoms/agent-actor-atom';

const Bootstrap: FC = () => {
    useAtomValue(shellyInstallEffectAtom);
    useAtomValue(petblackEffectAtom);
    useAtomValue(petblackThemeEffectAtom);
    useAtomValue(storageActorAtom);
    useAtomValue(shopActorAtom);
    useAtomValue(agentActorAtom);

    return null;
};

export default Bootstrap;
