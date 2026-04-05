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
import { lazy } from 'react';
import type { Cleanup, GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';
import { installWorkspaceEntry, Sizes, WorkspaceEntryTypes, type WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { installWidget, WIDGET, type WorkspaceWidgetEntry } from '@specfocus/shelly/lib/widgets/atoms/widget-entry';
import { WIDGETS_PATH } from '../widgets-path';
import { loadBuckets } from '../../dialogs/settings/sections/shop/domain/storage';
import shopSnapshotAtom from '@/atoms/shop-snapshot-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { TOGGLE, type ToggleAtom } from '@specfocus/atoms/lib/toggle';
import atom, { Getter, Setter } from '@specfocus/atoms/lib/atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import type { ToggleEntry } from '@specfocus/atoms/lib/toggle';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';

// ── lazy component ────────────────────────────────────────────────────────────

const LazyListWidget = lazy(() => import('./bucket-widget'));

// ── install ───────────────────────────────────────────────────────────────────

const installBuckets = (get: GetterWithPeek, set: SetterWithRecurse): Cleanup => {
    const cleanups: Cleanup[] = [];

    const buckets = loadBuckets();

    for (const name in buckets) {
        const bucketOpenAtom: ToggleAtom = atom(
            (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets[name]?.open,
            (_get: Getter, set: Setter, _next?: boolean): void => {
                set(shopActorAtom, { type: ShopEventTypes.ToggleBucketOpen, name });
            }
        );

        bucketOpenAtom.debugLabel = `${name}OpenAtom`;

        const bucketShowAtom: ToggleAtom = atom(
            (get: Getter): boolean | undefined => get(shopSnapshotAtom).context.buckets[name]?.show,
            (_get: Getter, set: Setter, _next?: boolean): void => {
                set(shopActorAtom, { type: ShopEventTypes.ToggleBucketShow, name });
            }
        );

        bucketShowAtom.debugLabel = `${name}ShowAtom`;

        const bucketWidgetPath: WorkspacePath = [...WIDGETS_PATH, name];
        const bucketOpenTogglePath: WorkspacePath = [...bucketWidgetPath, 'toggles', 'open'];
        const bucketShowTogglePath: WorkspacePath = [...bucketWidgetPath, 'toggles', 'show'];

        const bucketOpenToggle: ToggleEntry = {
            type: WorkspaceEntryTypes.Ephemeral,
            ephemeral: true,
            icon: OpenInFullRoundedIcon,
            variant: ToggleVariants.Switch,
            label: `petblack.widgets.${name}.toggles.open.label`,
            tooltip: `petblack.widgets.${name}.toggles.open.tooltip`,
            size: Sizes.Small,
            atom: bucketOpenAtom,
            resource: {
                '@type': TOGGLE,
                data: {},
                labelOn: `petblack.widgets.${name}.toggles.open.labelOn`,
                labelOff: `petblack.widgets.${name}.toggles.open.labelOff`,
            },
        };

        const bucketShowToggle: ToggleEntry = {
            type: WorkspaceEntryTypes.Ephemeral,
            ephemeral: true,
            icon: OpenInFullRoundedIcon,
            variant: ToggleVariants.Switch,
            label: `petblack.widgets.${name}.toggles.show.label`,
            tooltip: `petblack.widgets.${name}.toggles.show.tooltip`,
            size: Sizes.Small,
            atom: bucketShowAtom,
            resource: {
                '@type': TOGGLE,
                data: {},
                labelOn: `petblack.widgets.${name}.toggles.show.labelOn`,
                labelOff: `petblack.widgets.${name}.toggles.show.labelOff`,
            },
        };

        const bucketWidgetEntry: WorkspaceWidgetEntry = {
            type: WorkspaceEntryTypes.Ephemeral,
            ephemeral: true,
            label: 'petblack.widgets.bucket.label',
            tooltip: 'petblack.widgets.bucket.tooltip',
            resource: { '@type': WIDGET, data: {}, name },
            component: LazyListWidget,
            toggle: bucketShowTogglePath,
        };

        cleanups.push(installWidget(get, set, bucketWidgetEntry));
        cleanups.push(installWorkspaceEntry(get, set, bucketOpenTogglePath, bucketOpenToggle));
        cleanups.push(installWorkspaceEntry(get, set, bucketShowTogglePath, bucketShowToggle));
    }

    return (): void => {
        cleanups.reverse().forEach(cleanup => cleanup());
    };
};

export default installBuckets;
