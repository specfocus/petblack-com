import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

const cartOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.cartVisible,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shellActorAtom, { type: ShellEventTypes.ToggleFooter });
    }
);

cartOpenAtom.debugLabel = 'cartOpenAtom';

export default cartOpenAtom;
