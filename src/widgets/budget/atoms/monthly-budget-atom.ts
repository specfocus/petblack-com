import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';

const STORAGE_KEY = 'petblack.budget.monthly';

const readFromStorage = (): number => {
    if (typeof window === 'undefined') return 0;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = parseFloat(raw);
    return isNaN(parsed) ? 0 : parsed;
};

const _monthlyBudgetBacking = atom<number>(readFromStorage());

/**
 * Monthly budget atom — persisted to localStorage.
 * Reading returns the current budget (number).
 * Writing sets a new value and persists it.
 */
export const monthlyBudgetAtom = atom(
    (get: Getter): number => get(_monthlyBudgetBacking),
    (_get: Getter, set: Setter, next: number): void => {
        const clamped = Math.max(0, next);
        set(_monthlyBudgetBacking, clamped);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, String(clamped));
        }
    }
);

monthlyBudgetAtom.debugLabel = 'monthlyBudgetAtom';

export default monthlyBudgetAtom;
