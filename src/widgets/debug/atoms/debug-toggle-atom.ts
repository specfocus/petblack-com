import atom from '@specfocus/atoms/lib/atom';
import makeToggleAtom, { type ToggleAtom } from '@specfocus/atoms/lib/toggle';
import { atomTree } from '@specfocus/atoms/lib/tree';
import { DEBUG_WIDGET_PATH } from '../debug-widget-path';

export const DEBUG_TOGGLE_PATH = [...DEBUG_WIDGET_PATH, 'toggles', 'show'] as const;

const debugToggleStateTree = atomTree((_: string[]) => atom(false));

const debugToggleAtom: ToggleAtom = makeToggleAtom(debugToggleStateTree([...DEBUG_TOGGLE_PATH]));

debugToggleAtom.debugLabel = 'debugToggleAtom';

export default debugToggleAtom;
