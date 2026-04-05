import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';

export const buddyShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buddyShow,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopSnapshotAtom, { type: ShopEventTypes.ToggleBuddyShow });
    }
);

buddyShowAtom.debugLabel = 'buddyShowAtom';

export default buddyShowAtom;