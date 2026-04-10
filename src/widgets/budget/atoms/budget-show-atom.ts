import atom from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

const _budgetShowBacking = atom<boolean>(true);

export const budgetShowAtom: ToggleAtom = atom(
    (get) => get(_budgetShowBacking),
    (_get, set, _next?: boolean) => set(_budgetShowBacking, (prev: boolean) => !prev)
);

budgetShowAtom.debugLabel = 'budgetShowAtom';

export default budgetShowAtom;
