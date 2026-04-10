/**
 * Ledger Types
 *
 * A LedgerEntry represents a single purchase line item that has been recorded
 * in the purchase history.  It is stored in localStorage and used by the
 * Ledger view for charts and the transaction table.
 */

export const LEDGER_KEY = 'petblack.ledger';

// ── source ────────────────────────────────────────────────────────────────────

export enum LedgerSources {
    Cart = 'cart',
    Auto = 'auto',
}

export type LedgerSource = `${LedgerSources}`;

// ── entry ─────────────────────────────────────────────────────────────────────

export interface LedgerEntry {
    /** Stable unique ID (crypto.randomUUID or Date.now string) */
    id: string;
    /** ISO 8601 date string of when the purchase was recorded */
    date: string;
    /** Product SKU */
    sku: string;
    /** Human-readable product name */
    name: string;
    /** Product category derived from the SKU or product data */
    category: string;
    /** Name of the pet this purchase is associated with (custom bucket name or 'General') */
    petName: string;
    /** Quantity purchased */
    qty: number;
    /** Unit price at time of purchase */
    unitPrice: number;
    /** Where the item came from */
    source: LedgerSource;
}

// ── derived ───────────────────────────────────────────────────────────────────

export const ledgerEntryTotal = (e: LedgerEntry): number => e.qty * e.unitPrice;
