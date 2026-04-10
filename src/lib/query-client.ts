import { QueryClient } from '@specfocus/atoms/lib/query';

/**
 * Shared QueryClient singleton for petblack-com.
 * Imported by both the QueryClientProvider in App and any atomWithQuery atoms.
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Keep ledger data fresh for 5 minutes, then re-fetch in background
            staleTime: 5 * 60 * 1000,
            // Retry once on failure (API may be cold-starting)
            retry: 1,
        },
    },
});

export default queryClient;
