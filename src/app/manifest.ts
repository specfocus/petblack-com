import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'PetBLACK',
        short_name: 'PetBLACK',
        description: 'PetBLACK shopping and companion experience',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#000000',
        theme_color: '#000000',
        categories: ['shopping', 'lifestyle'],
        icons: [
            {
                src: '/icons/lowres.png',
                sizes: '48x48',
                type: 'image/png',
            },
            {
                src: '/icons/hd_hi.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/icons/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
            {
                src: '/icons/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'maskable',
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icons/icon-256x256.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icons/apple-icon-120x120.png',
                sizes: '120x120',
                type: 'image/png',
            },
            {
                src: '/icons/apple-icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
            },
            {
                src: '/icons/apple-icon-167x167.png',
                sizes: '167x167',
                type: 'image/png',
            },
            {
                src: '/icons/apple-icon-180x180.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
