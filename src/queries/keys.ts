import { PostFilters } from "../types/postTypes";

/**
 * Centralized query keys. Keeping them in one place makes invalidation
 * predictable (e.g. invalidating `postKeys.lists()` refreshes every list
 * regardless of its filters).
 */
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string | number) => [...postKeys.details(), String(id)] as const,
};

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  profile: (username: string) => [...userKeys.all, "profile", username] as const,
  connections: (username: string, type: "followers" | "following") =>
    [...userKeys.all, "connections", username, type] as const,
};

/**
 * Suggestions live outside `userKeys.all` on purpose: following someone
 * invalidates every user query, and re-fetching a randomized list would
 * reshuffle the cards under the user's cursor. The follow state of each
 * card comes from `/me`, which does refresh.
 */
export const communityKeys = {
  all: ["community"] as const,
  suggestions: (limit: number) =>
    [...communityKeys.all, "suggestions", limit] as const,
  explore: (batchSize: number) =>
    [...communityKeys.all, "explore", batchSize] as const,
};

export const tagKeys = {
  all: ["tags"] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
