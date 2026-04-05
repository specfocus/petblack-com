import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import atomEffect from '@specfocus/atoms/lib/effect';
import shellActorAtom from '@specfocus/shelly/lib/shell/atoms/shell-actor-atom';
import { ShellEventTypes } from '@specfocus/shelly/lib/shell/machine/shell-event-types';
import { ShellEffectTaskTypes } from '@specfocus/shelly/lib/shell/machine/shell-effect-task';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import agentActorAtom from './agent-actor-atom';
import agentSnapshotAtom from './agent-snapshot-atom';
import shopActorAtom from './shop-actor-atom';
import { AgentEventTypes } from '@/machines/agent/agent-event-types';
import { WIDGETS_PATH } from '../widgets/widgets-path';

const agentForwardingEffectAtom: ReadonlyAtom<void> = atomEffect((get, set) => {
    const snapshot = get(agentSnapshotAtom);

    const nextShopEvent = snapshot.context.forwardedShopEvents[0];
    if (nextShopEvent) {
        if (nextShopEvent.type === ShopEventTypes.OpenBucket) {
            const { name } = nextShopEvent as { type: string; name: string; };
            set(shellActorAtom, {
                type: ShellEventTypes.EnqueueEffectTasks,
                tasks: [
                    {
                        type: ShellEffectTaskTypes.ToggleWorkspacePath,
                        path: [...WIDGETS_PATH, name, 'toggles', 'show'],
                        value: true,
                    },
                    {
                        type: ShellEffectTaskTypes.ToggleWorkspacePath,
                        path: [...WIDGETS_PATH, name, 'toggles', 'open'],
                        value: true,
                    },
                ],
            });
        }
        set(shopActorAtom, nextShopEvent as never);
        set(agentActorAtom, { type: AgentEventTypes.ConsumeForwardedShopEvent });
    }

    const nextShellEvent = snapshot.context.forwardedShellEvents[0];
    if (nextShellEvent) {
        set(shellActorAtom, nextShellEvent as never);
        set(agentActorAtom, { type: AgentEventTypes.ConsumeForwardedShellEvent });
    }
});

agentForwardingEffectAtom.debugLabel = 'agentForwardingEffectAtom';

export default agentForwardingEffectAtom;
