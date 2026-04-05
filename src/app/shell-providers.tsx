'use client';

import AppThemeProvider from '@specfocus/shelly/lib/theme/theme-provider';
import Shelly from '@specfocus/shelly/lib/shelly';
import { Provider } from '@specfocus/atoms/lib/hooks/provider';
import { type FC, type PropsWithChildren } from 'react';
import Bootstrap from './bootstrap';
import I18nBridge from '@/lib/i18n-bridge';

const ShellProviders: FC<PropsWithChildren> = ({ children }) => (
    <Provider>
        <AppThemeProvider>
            <Bootstrap />
            <I18nBridge />
            <Shelly>
                {children}
            </Shelly>
        </AppThemeProvider>
    </Provider>
);

export default ShellProviders;
