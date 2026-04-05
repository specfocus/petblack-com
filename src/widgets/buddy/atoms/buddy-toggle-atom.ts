import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom, { type ToggleAtom } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { BUDDY_WIDGET_PATH } from '../buddy-widget-path';

export const BUDDY_TOGGLE_PATH = [...BUDDY_WIDGET_PATH, 'toggles', 'show'] as const;

const buddyToggleStateTree = atomTree((_: string[]) => atom(false));

export const buddyToggleAtom: ToggleAtom = makeToggleAtom(buddyToggleStateTree([...BUDDY_TOGGLE_PATH]));

buddyToggleAtom.debugLabel = 'buddyToggleAtom';

export default buddyToggleAtom;
