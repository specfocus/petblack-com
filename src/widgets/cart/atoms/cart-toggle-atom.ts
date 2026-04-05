import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom, { type ToggleAtom } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { CART_TOGGLE_PATH } from '../cart-path';

const cartToggleStateTree = atomTree((_: string[]) => atom(false));

export const cartToggleAtom: ToggleAtom = makeToggleAtom(cartToggleStateTree([...CART_TOGGLE_PATH]));

cartToggleAtom.debugLabel = 'cartToggleAtom';

export default cartToggleAtom;
