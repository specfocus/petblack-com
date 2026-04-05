import { setup } from '@specfocus/atoms/lib/machine';
import type { ShopContext, CreateShopMachineParams } from './shop-context';
import type { ShopEventUnion } from './shop-events';

const shopSetup = setup({
    types: {
        context: {} as ShopContext,
        events: {} as ShopEventUnion,
        input: {} as CreateShopMachineParams,
    },
});

export type ShopSetup = typeof shopSetup;

export default shopSetup;
