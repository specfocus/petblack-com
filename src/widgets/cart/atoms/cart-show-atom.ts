import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

export const cartShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.cartVisible,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shellActorAtom, { type: ShellEventTypes.ToggleFooter });
    }
);

cartShowAtom.debugLabel = 'cartShowAtom';

export default cartShowAtom;