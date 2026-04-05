import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';

const debugOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.debugOpen,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopSnapshotAtom, { type: ShopEventTypes.ToggleDebugOpen });
    }
);

debugOpenAtom.debugLabel = 'debugOpenAtom';

export default debugOpenAtom;
