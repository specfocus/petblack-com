/**
 * shopListsAtom
 *
 * Writable atom backed by localStorage.
 * Reading gives the current ShopList[].
 * Writing takes an updater function (ShopList[] => ShopList[]) or a new array,
 * saves to localStorage, and notifies all subscribers.
 */
import atom from '@specfocus/atoms/lib/atom';
import {
    loadLists,
    saveLists,
} from '../domain/storage';
import type { ShopList } from '../domain/types';

type Updater = (prev: ShopList[]) => ShopList[];

const _listsStateAtom = atom<ShopList[]>(loadLists());

const shopListsAtom = atom<ShopList[], [ShopList[] | Updater], void>(
    (get) => get(_listsStateAtom),
    (get, set, update) => {
        const prev = get(_listsStateAtom);
        const next = typeof update === 'function' ? update(prev) : update;
        set(_listsStateAtom, next);
        saveLists(next);
    }
);

shopListsAtom.debugLabel = 'shopListsAtom';

export default shopListsAtom;
