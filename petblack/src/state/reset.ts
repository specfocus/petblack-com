import {type WritableAtom} from "jotai/vanilla/atom";
import {RESET} from "jotai/vanilla/utils/constants";

export {atomWithReset} from "jotai/vanilla/utils/atomWithReset";
export {RESET};

export type SetStateActionWithReset<Value> = Value | typeof RESET | ((prev: Value) => Value | typeof RESET);

export type WithInitialValue<Value> = {
    init: Value;
};

export type ReadonlyAtomWithReset<Value> = WritableAtom<Value, [SetStateActionWithReset<typeof RESET>], void> & WithInitialValue<Value>;

export type AtomWithReset<Value> = WritableAtom<Value, [SetStateActionWithReset<Value>], void> & WithInitialValue<Value>;
