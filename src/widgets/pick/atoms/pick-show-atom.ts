import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { ShellEventTypes } from '@specfocus/shelly/lib/shell/machine/shell-event-types';

export const pickShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets['drug']?.show,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopSnapshotAtom, { type: ShellEventTypes.ToggleBucketShow, name: 'drug' });
    }
);

pickShowAtom.debugLabel = 'pickShowAtom';

export default pickShowAtom;