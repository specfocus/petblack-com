import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ShellProviders from './shell-providers';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "petblack",
    description: "petblack",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AppRouterCacheProvider options={{ key: 'mui' }}>
                    <ShellProviders>
                        {children}
                    </ShellProviders>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
