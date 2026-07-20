import { QueryClient } from "@tanstack/react-query";

/**
 * Defaults tuned for a slow API (~1.2-2s per request):
 * - staleTime > 0 so navigating back to a page serves cache instantly instead
 *   of re-hitting the API and showing a skeleton again (stale-while-revalidate).
 * - no refetch on window focus: every refetch costs ~2s, so don't spend it
 *   just because the user alt-tabbed.
 * - retry once: a slow endpoint shouldn't be hammered on failure.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // matches the backend's Cache-Control max-age=30
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
