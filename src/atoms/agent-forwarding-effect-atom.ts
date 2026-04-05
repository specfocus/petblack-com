import type { ReadonlyAtom } from '@specfocus/atoms/lib/atom';
import atomEffect from '@specfocus/atoms/lib/effect';
import shellActorAtom from '@specfocus/shelly/lib/shell/atoms/shell-actor-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import agentActorAtom from './agent-actor-atom';
import agentSnapshotAtom from './agent-snapshot-atom';
import shopActorAtom from './shop-actor-atom';
import { AgentEventTypes } from '@/machines/agent/agent-event-types';
import cartToggleAtom from '@/widgets/cart/atoms/cart-toggle-atom';

const agentForwardingEffectAtom: ReadonlyAtom<void> = atomEffect((get, set) => {
    const snapshot = get(agentSnapshotAtom);

    const nextShopEvent = snapshot.context.forwardedShopEvents[0];
    if (nextShopEvent) {
        if (nextShopEvent.type === ShopEventTypes.OpenCart) {
            set(cartToggleAtom, true);
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
