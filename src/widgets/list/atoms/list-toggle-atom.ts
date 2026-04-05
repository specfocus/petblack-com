import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom, { type ToggleAtom } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { LIST_TOGGLE_PATH } from '../list-path';

const listToggleStateTree = atomTree((_: string[]) => atom(false));

export const listToggleAtom: ToggleAtom = makeToggleAtom(listToggleStateTree([...LIST_TOGGLE_PATH]));

listToggleAtom.debugLabel = 'listToggleAtom';

export default listToggleAtom;
