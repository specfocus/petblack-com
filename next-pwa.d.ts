declare module 'next-pwa' {
    import type { NextConfig } from 'next';

    interface NextPWAOptions {
        dest: string;
        disable?: boolean;
        register?: boolean;
        skipWaiting?: boolean;
    }

    type NextPWA = (nextConfig: NextConfig) => NextConfig;

    export default function withPWA(options: NextPWAOptions): NextPWA;
}
