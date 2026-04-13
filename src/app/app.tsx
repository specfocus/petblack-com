'use client';

import agentActorAtom from '@/atoms/agent-actor-atom';
import agentForwardingEffectAtom from '@/atoms/agent-forwarding-effect-atom';
import installEffectAtom from '@/atoms/install-effect-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import storageActorAtom from '@/atoms/storage-actor-atom';
import queryClient from '@/lib/query-client';
import themeEffectAtom from '@/theme/theme-effect-atom';
import { Provider } from '@specfocus/atoms/lib/hooks/provider';
import { useAtomValue } from '@specfocus/atoms/lib/hooks/use-atom-value';
import { useHydrateAtoms } from '@specfocus/atoms/lib/hooks/use-hydrate-atoms';
import { queryClientAtom } from '@specfocus/atoms/lib/query';
import Alerts from '@specfocus/shelly/lib/alerts/alerts';
import shellyInstallEffectAtom from '@specfocus/shelly/lib/atoms/install-effect-atom';
import feedbackEffectAtom from '@specfocus/shelly/lib/atoms/feedback-effect-atom';
import { slotsPerSlideEffectAtom } from '@specfocus/shelly/lib/atoms/slots-per-slide-effect-atom';
import sidebarLayoutGuardEffectAtom from '@specfocus/shelly/lib/shell/sidebars/atoms/sidebar-layout-guard-effect-atom';
import { windowSizeAtom } from '@specfocus/shelly/lib/shell/atoms/window-size-atom';
import workspaceViewEffectAtom from '@specfocus/shelly/lib/workspace/atoms/workspace-view-effect-atom';
import Shelly from '@specfocus/shelly/lib/shelly';
import AppThemeProvider from '@specfocus/shelly/lib/theme/theme-provider';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { PawSvg } from './icons/paw-svg';

/** One-time hint on stage: shelly swiper logs are opt-in (`?shellyDebugSwiper=1` or localStorage). */
const StageSwiperDebugHint: FC = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.location.hostname !== 'stage.petblack.com') return;
        try {
            const enabled =
                window.localStorage.getItem('shelly:debug:swiper') === '1' ||
                new URLSearchParams(window.location.search).get('shellyDebugSwiper') === '1';
            if (enabled) return;
        } catch {
            return;
        }
        console.info(
            '[petblack][stage] Shelly swiper trace logs are OFF until you enable them. ' +
                'Option A: add ?shellyDebugSwiper=1 to this URL and reload. ' +
                'Option B: localStorage.setItem("shelly:debug:swiper","1"); location.reload(). ' +
                'Then look for [shelly:swiper] lines — they use console.warn (show Warnings in the console filter).'
        );
    }, []);
    return null;
};

const Bootstrap: FC = () => {
    // Seed queryClientAtom into the jotai store before any atomWithQuery runs.
    // useHydrateAtoms is the jotai v2 replacement for the removed initialValues prop.
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    useAtomValue(shellyInstallEffectAtom);
    useAtomValue(sidebarLayoutGuardEffectAtom);
    useAtomValue(slotsPerSlideEffectAtom);
    useAtomValue(windowSizeAtom);
    useAtomValue(feedbackEffectAtom);
    useAtomValue(workspaceViewEffectAtom);
    useAtomValue(installEffectAtom);
    useAtomValue(storageActorAtom);
    useAtomValue(shopActorAtom);
    useAtomValue(agentActorAtom);
    useAtomValue(agentForwardingEffectAtom);
    useAtomValue(themeEffectAtom);

    return null;
};

const App: FC<PropsWithChildren> = ({ children }) => (
    <Provider>
        <AppThemeProvider>
            <Shelly appIcon={<PawSvg size={20} fill="currentColor" />}>
                <StageSwiperDebugHint />
                <Bootstrap />
                {children}
            </Shelly>
            <Alerts />
        </AppThemeProvider>
    </Provider>
);

export default App;
