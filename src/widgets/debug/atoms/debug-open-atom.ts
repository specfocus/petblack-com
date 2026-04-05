import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

const debugOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.debugVisible,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shellActorAtom, { type: ShellEventTypes.ToggleFooter });
    }
);

debugOpenAtom.debugLabel = 'debugOpenAtom';

export default debugOpenAtom;
