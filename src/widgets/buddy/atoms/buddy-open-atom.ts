import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

const buddyOpenAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buddyVisible,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shellActorAtom, { type: ShellEventTypes.ToggleFooter });
    }
);

buddyOpenAtom.debugLabel = 'buddyOpenAtom';

export default buddyOpenAtom;
