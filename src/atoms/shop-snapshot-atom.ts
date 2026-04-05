import type { WritableAtom } from '@specfocus/atoms/lib/atom';
import type { Getter } from '@specfocus/atoms/lib/atom';
import type { SnapshotFrom } from '@specfocus/atoms/lib/machine';
import { atomWithActorSnapshot } from '@specfocus/atoms/lib/machine';
import type { ShopMachine } from '@/machines/shop/shop-machine';
import shopActorAtom from './shop-actor-atom';

const shopSnapshotAtom: WritableAtom<SnapshotFrom<ShopMachine>, never[], void> = atomWithActorSnapshot(
    (get: Getter) => get(shopActorAtom)
) as WritableAtom<SnapshotFrom<ShopMachine>, never[], void>;

export default shopSnapshotAtom;
