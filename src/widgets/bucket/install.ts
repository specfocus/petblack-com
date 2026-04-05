/**
 * widgets/bucket/install
 *
 * Installs the List widget into the shelly shell.
 *
 * Registers:
 * - Toggle entry — ToggleEntry at LIST_TOGGLE_PATH (renders 📋 dial button)
 * - Widget entry — WorkspaceWidgetEntry at LIST_WIDGET_PATH via installWidget
 * - Dial button  — registers the bucket toggle under shelly's dial/actions registry
 */

import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import { createElement, lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { installWorkspaceEntry, Sizes, WorkspaceEntryTypes, type WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { WIDGETS_PATH } from '../widgets-path';
import bucketsAtom from '../../atoms/buckets-atom';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { TOGGLE, type ToggleAtom } from '@specfocus/atoms/lib/toggle';
import atom, { Getter, Setter } from '@specfocus/atoms/lib/atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { PrefabBucketNames } from '@/domain/types';

// Prefab buckets that have their own dedicated install files — skip them here
// to avoid double-registering their toggle/widget entries.
const DEDICATED_INSTALLS = new Set<string>([
    PrefabBucketNames.Auto,
    PrefabBucketNames.Cart,
    PrefabBucketNames.Diet,
    PrefabBucketNames.Drug,
    PrefabBucketNames.Pick,
]);

// ── install ───────────────────────────────────────────────────────────────────

const installBuckets = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanups: Cleanup[] = [];

    const buckets = get(bucketsAtom);
    const names = Object.keys(buckets);

    for (const bucketName of names) {
        if (DEDICATED_INSTALLS.has(bucketName)) continue; // skip buckets with their own install file

        // Create a dedicated lazy wrapper per bucket so the bucketName prop is
        // baked into the component reference. WidgetShell renders <Component />
        // with no props, so every instance would otherwise fall back to 'want'.
        const LazyBucketWidget = lazy(() =>
            import('./bucket-widget').then(mod => ({
                default: () => createElement(mod.default, { bucketName }),
            }))
        );

        const bucketWidgetPath: WorkspacePath = [...WIDGETS_PATH, bucketName];
        const bucketOpenTogglePath: WorkspacePath = [...bucketWidgetPath, 'toggles', 'open'];
        const bucketShowTogglePath: WorkspacePath = [...bucketWidgetPath, 'toggles', 'show'];

        const bucketOpenAtom: ToggleAtom = atom(
            (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets[bucketName]?.open,
            (_get: Getter, set: Setter, _next?: boolean): void => {
                set(shopActorAtom, { type: ShopEventTypes.ToggleBucketOpen, name: bucketName });
            }
        );
        bucketOpenAtom.debugLabel = `${bucketName}OpenAtom`;

        const bucketShowAtom: ToggleAtom = atom(
            (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets[bucketName]?.show,
            (_get: Getter, set: Setter, _next?: boolean): void => {
                set(shopActorAtom, { type: ShopEventTypes.ToggleBucketShow, name: bucketName });
            }
        );
        bucketShowAtom.debugLabel = `${bucketName}ShowAtom`;

        const bucketOpenToggle: ToggleEntry = {
            type: WorkspaceEntryTypes.Ephemeral,
            ephemeral: true,
            icon: OpenInFullRoundedIcon,
            variant: ToggleVariants.Switch,
            label: `petblack.widgets.${bucketName}.toggles.open.label`,
            tooltip: `petblack.widgets.${bucketName}.toggles.open.tooltip`,
            size: Sizes.Small,
            atom: bucketOpenAtom,
            resource: {
                '@type': TOGGLE,
                data: {},
                labelOn: `petblack.widgets.${bucketName}.toggles.open.labelOn`,
                labelOff: `petblack.widgets.${bucketName}.toggles.open.labelOff`,
            },
        };

        const bucketShowToggle: ToggleEntry = {
            type: WorkspaceEntryTypes.Ephemeral,
            ephemeral: true,
            icon: OpenInFullRoundedIcon,
            variant: ToggleVariants.Switch,
            label: `petblack.widgets.${bucketName}.toggles.show.label`,
            tooltip: `petblack.widgets.${bucketName}.toggles.show.tooltip`,
            size: Sizes.Small,
            atom: bucketShowAtom,
            resource: {
                '@type': TOGGLE,
                data: {},
                labelOn: `petblack.widgets.${bucketName}.toggles.show.labelOn`,
                labelOff: `petblack.widgets.${bucketName}.toggles.show.labelOff`,
            },
        };

        // Toggles must be in the tree BEFORE installWidget, because WidgetShell
        // resolves entry.toggle at mount — if the atom isn't there yet it returns
        // null and the widget never renders.
        cleanups.push(installWorkspaceEntry(get, set, bucketOpenTogglePath, bucketOpenToggle));
        cleanups.push(installWorkspaceEntry(get, set, bucketShowTogglePath, bucketShowToggle));

        const bucketWidgetEntry: WorkspaceWidgetEntry = {
            type: WorkspaceEntryTypes.Ephemeral,
            ephemeral: true,
            label: `petblack.widgets.${bucketName}.label`,
            tooltip: `petblack.widgets.${bucketName}.tooltip`,
            resource: { '@type': WIDGET, data: {}, name: bucketName },
            component: LazyBucketWidget,
            toggle: bucketShowTogglePath,
        };

        cleanups.push(installWidget(get, set, bucketWidgetEntry));
    }

    return (): void => {
        cleanups.reverse().forEach(cleanup => cleanup());
    };
};

export default installBuckets;
