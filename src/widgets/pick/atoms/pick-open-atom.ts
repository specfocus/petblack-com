import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { ShellEventTypes } from '@specfocus/shelly/lib/shell/machine/shell-event-types';

const pickOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets['pick']?.open,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopSnapshotAtom, { type: ShellEventTypes.ToggleBucketOpen, name: 'pick' });
    }
);

pickOpenAtom.debugLabel = 'pickOpenAtom';

export default pickOpenAtom;
