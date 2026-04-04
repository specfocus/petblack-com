export {
    focusManager,
    notifyManager,
    onlineManager,
    QueryClient,
    type DefaultError,
    type DefinedInfiniteQueryObserverResult,
    type DefinedQueryObserverResult,
    type InfiniteData,
    type InfiniteQueryObserverOptions,
    type InfiniteQueryObserverResult,
    type MutationObserverOptions,
    type MutationObserverResult,
    type QueryKey,
    type MutateFunction as QueryMutateFunction,
    type QueryObserverOptions,
    type QueryObserverResult,
    type WithRequired
} from "@tanstack/query-core";
// https://jotai.org/docs/extensions/query
export {
    atomWithInfiniteQuery,
    atomWithMutation,
    atomWithMutationState,
    atomWithQuery,
    atomWithSuspenseInfiniteQuery,
    atomWithSuspenseQuery,
    queryClientAtom,
    type AtomWithInfiniteQueryOptions,
    type AtomWithInfiniteQueryResult,
    type AtomWithMutationResult,
    type AtomWithQueryOptions,
    type AtomWithQueryResult,
    type AtomWithSuspenseInfiniteQueryOptions,
    type AtomWithSuspenseInfiniteQueryResult,
    type AtomWithSuspenseQueryOptions,
    type AtomWithSuspenseQueryResult,
    type BaseAtomWithQueryOptions,
    type DefinedAtomWithInfiniteQueryResult,
    type DefinedAtomWithQueryResult,
    type DefinedInitialDataInfiniteOptions,
    type DefinedInitialDataOptions,
    type MutateAsyncFunction,
    type MutateFunction,
    type MutationOptions,
    type UndefinedInitialDataInfiniteOptions,
    type UndefinedInitialDataOptions
} from "jotai-tanstack-query";

export type NonUndefinedGuard<T> = T extends undefined ? never : T;

export type Override<A, B> = {
    [K in keyof A]: K extends keyof B ? B[K] : A[K];
};
