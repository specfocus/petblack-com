import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from "next";
import type { Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import ShellProviders from './shell-providers';
import './globals.css';

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
        icon: [{ url: '/icon', type: 'image/png' }],
        apple: [{ url: '/apple-icon', type: 'image/png' }],
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`} data-app-shell>
                <AppRouterCacheProvider options={{ key: 'mui' }}>
                    <ShellProviders>
                        {children}
                    </ShellProviders>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
