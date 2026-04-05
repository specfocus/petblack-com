import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import { PrefabBucketNames } from '@/dialogs/settings/sections/shop/domain/types';

export const cartShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets[PrefabBucketNames.Cart]?.show,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopActorAtom, { type: ShopEventTypes.ToggleBucketShow, name: PrefabBucketNames.Cart });
    }
);

cartShowAtom.debugLabel = 'cartShowAtom';

export default cartShowAtom;
