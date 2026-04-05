import atom, { type Atom } from '@specfocus/atoms/lib/atom';
import shopMachine from '@/machines/shop/shop-machine';
import type { ShopMachine } from '@/machines/shop/shop-machine';

const shopMachineAtom: Atom<ShopMachine> = atom<ShopMachine>(shopMachine);

export default shopMachineAtom;
