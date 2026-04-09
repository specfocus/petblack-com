/**
 * petblack — English locale
 *
 * Package strings are now registered automatically by each package's installI18n effect.
 * Only app-specific strings are defined here.
 */
import petblackEn from './petblack/en';

const en = {
    // ── petblack namespace ────────────────────────────────────────────────────
    ...petblackEn,
    // ── App-specific ─────────────────────────────────────────────────────────
    app: {
        title: 'PetBLACK',
    },
};

export default en;
