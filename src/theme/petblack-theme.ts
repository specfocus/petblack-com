import type { ThemeOptions } from '@mui/material/styles';

/**
 * Petblack Theme
 *
 * A warm amber-gold on deep-black palette that echoes the brand name
 * while feeling approachable for a pet-product audience.
 *
 * Primary  — amber gold  #D4A017  (fur / eyes)
 * Secondary — tawny rust  #C2692A  (warmth / energy)
 * Background — near-black  #0E0E0F / #1A1A1C
 */

export const petblackDark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#D4A017',
            light: '#E8BA45',
            dark: '#A87C0D',
            contrastText: '#0E0E0F',
        },
        secondary: {
            main: '#C2692A',
            light: '#D98A52',
            dark: '#974F1E',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#E05252',
            light: '#E87676',
            dark: '#B33A3A',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#E8A020',
            light: '#F0B84A',
            dark: '#B87C18',
            contrastText: '#0E0E0F',
        },
        info: {
            main: '#6FA3C8',
            light: '#93BDD8',
            dark: '#4F7EA0',
            contrastText: '#0E0E0F',
        },
        success: {
            main: '#6AB187',
            light: '#8DC8A2',
            dark: '#4A8B65',
            contrastText: '#0E0E0F',
        },
        background: {
            default: '#0E0E0F',
            paper: '#1A1A1C',
        },
        text: {
            primary: '#F5F0E8',
            secondary: '#B8A990',
            disabled: '#5C5548',
        },
        divider: '#2E2B26',
        action: {
            hover: 'rgba(212, 160, 23, 0.10)',
            selected: 'rgba(212, 160, 23, 0.18)',
            disabled: '#3E3A33',
            disabledBackground: '#252320',
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily:
            "var(--font-geist-sans), Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.015em' },
        h3: { fontWeight: 600, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 500 },
        subtitle2: {
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.75rem',
        },
        body2: { fontSize: '0.875rem' },
        button: { fontWeight: 600, textTransform: 'none' },
    },
};

export const petblackLight: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#A87C0D',
            light: '#D4A017',
            dark: '#7A5A09',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#C2692A',
            light: '#D98A52',
            dark: '#974F1E',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#C0392B',
            light: '#D95F52',
            dark: '#962D21',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#B87C18',
            light: '#D4A017',
            dark: '#8A5C10',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#3A7CA8',
            light: '#5A9CC0',
            dark: '#285E80',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#3A7A57',
            light: '#5A9A72',
            dark: '#285C3E',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FAF7F2',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1410',
            secondary: '#5C4E38',
            disabled: '#A89880',
        },
        divider: '#E8E0D0',
        action: {
            hover: 'rgba(168, 124, 13, 0.08)',
            selected: 'rgba(168, 124, 13, 0.14)',
            disabled: '#C8BFB0',
            disabledBackground: '#EDE8E0',
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily:
            "var(--font-geist-sans), Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.015em' },
        h3: { fontWeight: 600, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 500 },
        subtitle2: {
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.75rem',
        },
        body2: { fontSize: '0.875rem' },
        button: { fontWeight: 600, textTransform: 'none' },
    },
};
