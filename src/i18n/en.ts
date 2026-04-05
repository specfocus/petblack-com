/**
 * petblack — English locale
 *
 * Canonical package strings are imported directly from their packages.
 * Only app-specific strings are defined here.
 */
import shellyEn from '@specfocus/shelly/lib/i18n/en';
import petblackEn from './petblack/en';

const en = {
    // ── Package strings (canonical — do not redefine here) ───────────────────
    ...shellyEn,
    // ── petblack namespace ────────────────────────────────────────────────────
    ...petblackEn,
    // ── App-specific ─────────────────────────────────────────────────────────
    app: {
        title: 'PetBLACK',
    },
};

export default en;
