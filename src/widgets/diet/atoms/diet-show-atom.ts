import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { ShellEventTypes } from '@specfocus/shelly/lib/shell/machine/shell-event-types';

export const dietShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.dietShow,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopSnapshotAtom, { type: ShellEventTypes.ToggleCartShow });
    }
);

dietShowAtom.debugLabel = 'dietShowAtom';

export default dietShowAtom;