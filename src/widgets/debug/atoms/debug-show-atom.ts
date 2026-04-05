import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';

const debugShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.debugShow,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopSnapshotAtom, { type: ShopEventTypes.ToggleDebugOpen });
    }
);

debugShowAtom.debugLabel = 'debugShowAtom';

export default debugShowAtom;