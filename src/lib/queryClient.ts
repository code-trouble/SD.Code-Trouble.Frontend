import { QueryClient } from "@tanstack/react-query";
import { userKeys } from "../queries/keys";

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

/**
 * Drop everything user-specific after a logout / expired session.
 *
 * NEVER `queryClient.clear()` here: clear() evicts the `/me` query while its
 * observer (mounted in App.tsx) is still subscribed. The observer then rebuilds
 * the query with `data === undefined`, which makes it refetch immediately ->
 * 401 -> interceptor -> clear() -> ... an unthrottled request loop (this was
 * the landing-page "1k+ requests" bug).
 *
 * Instead, seed `/me` with `null` FIRST — a fresh, valid "logged out" answer
 * the observer can hold on to — and only then remove the other queries.
 */
export function resetToSignedOut() {
  queryClient.setQueryData(userKeys.me(), null);
  queryClient.removeQueries({
    predicate: (query) => !(query.queryKey[0] === "users" && query.queryKey[1] === "me"),
  });
}
