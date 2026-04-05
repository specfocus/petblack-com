import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import { PrefabBucketNames } from '@/domain/types';

const drugOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets[PrefabBucketNames.Drug]?.open,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shopActorAtom, { type: ShopEventTypes.ToggleBucketOpen, name: PrefabBucketNames.Drug });
    }
);

drugOpenAtom.debugLabel = 'drugOpenAtom';

export default drugOpenAtom;
