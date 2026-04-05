'use client';

/**
 * I18nBridge — connects petblack's translation messages to the i18n engine.
 *
 * Registers locale loaders for every supported locale, then mounts
 * Shelly's I18nBridge which attaches the Jotai store and triggers the
 * initial locale load.
 *
 * Adding a new locale:
 *   1. Create  src/i18n/<locale>.ts  merging shellyEn + local strings.
 *   2. Add a registerLocaleLoader call below.
 *   3. Add the locale to LOCALE_OPTIONS so it appears in Settings > General.
 */

import ShellyI18nBridge from '@specfocus/shelly/lib/i18n-bridge';
import { localeOptionsAtom, registerLocaleLoader } from '@specfocus/atoms/lib/i18n';
import { getDefaultStore } from '@specfocus/atoms/lib/store';

// ---------------------------------------------------------------------------
// Locale options — drives the language select in Settings > General.
// ---------------------------------------------------------------------------
const LOCALE_OPTIONS = [
    { value: 'en', label: 'English' },
];

getDefaultStore().set(localeOptionsAtom, LOCALE_OPTIONS);

// ---------------------------------------------------------------------------
// Locale loaders — lazy so only the active locale bundle is fetched.
// ---------------------------------------------------------------------------
registerLocaleLoader('en', async () => {
    const { default: en } = await import('../i18n/en');
    return en as unknown as Record<string, unknown>;
});

/**
 * I18nBridge — mount inside the Jotai Provider, before any translated component.
 */
const I18nBridge = () => <ShellyI18nBridge />;

export default I18nBridge;
