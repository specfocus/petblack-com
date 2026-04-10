import atom from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

const _budgetOpenBacking = atom<boolean>(false);

export const budgetOpenAtom: ToggleAtom = atom(
    (get) => get(_budgetOpenBacking),
    (_get, set, _next?: boolean) => set(_budgetOpenBacking, (prev: boolean) => !prev)
);

budgetOpenAtom.debugLabel = 'budgetOpenAtom';

export default budgetOpenAtom;
