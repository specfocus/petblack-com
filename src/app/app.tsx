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
import { type FC, type PropsWithChildren } from 'react';
import { PawSvg } from './icons/paw-svg';

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
                <Bootstrap />
                {children}
            </Shelly>
            <Alerts />
        </AppThemeProvider>
    </Provider>
);

export default App;
