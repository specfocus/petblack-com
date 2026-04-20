import type { GetterWithPeek, SetterWithRecurse } from '@specfocus/atoms/lib/effect';

const install = (get: GetterWithPeek, set: SetterWithRecurse) => ({
    // It must deactivate the dial widget and the app bar to give a full screen experience
});

export default install;