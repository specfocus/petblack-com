import atom, { type Getter, type Setter } from '@specfocus/atoms/lib/atom';
import type { ToggleAtom } from '@specfocus/atoms/lib/toggle';

export const buddyShowAtom: ToggleAtom = atom(
    (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buddyVisible,
    (_get: Getter, set: Setter, _next?: boolean): void => {
        set(shellActorAtom, { type: ShellEventTypes.ToggleFooter });
    }
);

buddyShowAtom.debugLabel = 'buddyShowAtom';

export default buddyShowAtom;