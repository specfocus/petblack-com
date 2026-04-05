/**
 * bucketsAtom
 *
 * Writable atom backed by localStorage.
 * Reading gives the current Bucket[].
 * Writing takes an updater function (Bucket[] => Bucket[]) or a new array,
 * saves to localStorage, and notifies all subscribers.
 */
import atom from '@specfocus/atoms/lib/atom';
import {
    loadBuckets,
    saveBuckets,
} from '../domain/storage';
import type { Bucket } from '../domain/types';

type Updater = (prev: Bucket[]) => Bucket[];

const _bucketsStateAtom = atom<Bucket[]>(loadBuckets());

const bucketsAtom = atom<Bucket[], [Bucket[] | Updater], void>(
    (get) => get(_bucketsStateAtom),
    (get, set, update) => {
        const prev = get(_bucketsStateAtom);
        const next = typeof update === 'function' ? update(prev) : update;
        set(_bucketsStateAtom, next);
        saveBuckets(next);
    }
);

bucketsAtom.debugLabel = 'bucketsAtom';

export default bucketsAtom;
