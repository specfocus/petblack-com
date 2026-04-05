/**
 * AppMessages — the full typed message shape for petblack.
 *
 * Extends ShellyMessages so that any component using
 * `useTranslations()` from shelly gets correct key inference.
 *
 * `app.*`      — host-app–specific strings (title, etc.)
 * `shelly.*`   — shelly built-in strings
 * `petblack.*` — petblack widgets, settings sections, and views
 */
import type { ShellyMessages } from '@specfocus/shelly/lib/i18n';
import type petblackEn from './petblack/en';

/** Shape of the petblack-specific namespace */
export type PetblackMessages = typeof petblackEn;

/** Full message shape for the petblack app */
export interface AppMessages extends ShellyMessages, PetblackMessages {
    app: {
        title: string;
    };
}
