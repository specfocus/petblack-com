'use client';

import petblackEffectAtom from '@/atoms/petblack-effect-atom';
import petblackThemeEffectAtom from '@/theme/petblack-theme-effect-atom';
import { useAtomValue } from '@specfocus/atoms/lib/hooks/use-atom-value';
import ShellyBootstrap from '@specfocus/shelly/lib/app/bootstrap';
import { type FC } from 'react';
import storageActorAtom from '@/atoms/storage-actor-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import agentActorAtom from '@/atoms/agent-actor-atom';

const Bootstrap: FC = () => {
    useAtomValue(petblackEffectAtom);
    useAtomValue(petblackThemeEffectAtom);
    useAtomValue(storageActorAtom);
    useAtomValue(shopActorAtom);
    useAtomValue(agentActorAtom);

    return <ShellyBootstrap />;
};

export default Bootstrap;
