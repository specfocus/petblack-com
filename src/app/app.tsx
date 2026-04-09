'use client';

import agentActorAtom from '@/atoms/agent-actor-atom';
import agentForwardingEffectAtom from '@/atoms/agent-forwarding-effect-atom';
import installEffectAtom from '@/atoms/install-effect-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import storageActorAtom from '@/atoms/storage-actor-atom';
import themeEffectAtom from '@/theme/theme-effect-atom';
import { Provider } from '@specfocus/atoms/lib/hooks/provider';
import { useAtomValue } from '@specfocus/atoms/lib/hooks/use-atom-value';
import Alerts from '@specfocus/shelly/lib/alerts/alerts';
import ShellyBootstrap from '@specfocus/shelly/lib/bootstrap';
import Shelly from '@specfocus/shelly/lib/shelly';
import AppThemeProvider from '@specfocus/shelly/lib/theme/theme-provider';
import { type FC, type PropsWithChildren } from 'react';

const Bootstrap: FC = () => {
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
            <ShellyBootstrap>
                <Bootstrap />
            </ShellyBootstrap>
            <Shelly>
                {children}
            </Shelly>
            <Alerts />
        </AppThemeProvider>
    </Provider>
);

export default App;
