import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from 'react';

import './globals.css';

import { Baloo_2, JetBrains_Mono } from 'next/font/google';

import 'katex/dist/katex.min.css';

const baloo = Baloo_2({
    variable: '--font-baloo',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'PetBLACK',
    description: 'PetBLACK shopping and companion experience',
    manifest: '/manifest.webmanifest',
    applicationName: 'PetBLACK',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'PetBLACK',
    },
    icons: {
        icon: [
            { url: '/icons/icon.svg', type: 'image/svg+xml' },
            { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/icons/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
            { url: '/icons/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
            { url: '/icons/apple-icon-167x167.png', sizes: '167x167', type: 'image/png' },
            { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: [{ url: '/icons/lowres.png', sizes: '48x48', type: 'image/png' }],
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
};

export default function RootLayout({
    children,
}: PropsWithChildren) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${jetbrainsMono.variable}`} data-app-shell>
                <AppRouterCacheProvider options={{ key: 'mui' }}>
                    {children}
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
