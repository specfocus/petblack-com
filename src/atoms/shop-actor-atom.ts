import type { WritableAtom } from '@specfocus/atoms/lib/atom';
import type { Getter } from '@specfocus/atoms/lib/atom';
import { atomWithActor, type RESTART } from '@specfocus/atoms/lib/machine';
import shopMachine, { SHOP_SYSTEM_ID } from '@/machines/shop/shop-machine';
import type { ShopActor } from '@/machines/shop/shop-machine';
import type { ShopEventUnion } from '@/machines/shop/shop-events';

const shopActorAtom: WritableAtom<ShopActor, [ShopEventUnion | typeof RESTART], void> = atomWithActor(
    () => shopMachine,
    (_get: Getter) => ({
        systemId: SHOP_SYSTEM_ID,
        input: {},
    })
) as WritableAtom<ShopActor, [ShopEventUnion | typeof RESTART], void>;

export default shopActorAtom;
