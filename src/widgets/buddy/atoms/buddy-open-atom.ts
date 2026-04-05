import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';

const buddyOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buddyOpen,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopActorAtom, { type: ShopEventTypes.ToggleBuddyOpen });
    }
);

buddyOpenAtom.debugLabel = 'buddyOpenAtom';

export default buddyOpenAtom;
