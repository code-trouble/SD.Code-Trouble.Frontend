import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { api } from "../services/api";
import { markSessionStarted } from "../services/session";
import { useAuthModalStore } from "../stores/authModalStore";
import type { UpdateProfileData, User, UserSummary } from "../types/userTypes";
import { communityKeys, userKeys } from "./keys";

const fetchMe = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/users/me");
    // Covers browsers that logged in before the session hint existed: a
    // working session proves a refresh cookie is there.
    markSessionStarted();
    return data;
  } catch (error) {
    // Not logged in is a valid state, not an error to retry.
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
};

export const useMe = () =>
  useQuery({
    queryKey: userKeys.me(),
    queryFn: fetchMe,
    staleTime: 5 * 60_000, // the session rarely changes mid-visit
    retry: false,
  });

/** Convenience: the logged-in user (or null). Backed by the cached /me query,
 *  so calling it from many components costs a single request. */
export const useCurrentUser = (): User | null => useMe().data ?? null;

/** Set of user ids the current user follows, derived from /me. */
export const useFollowingIds = (): Set<number> => {
  const { data: me } = useMe();
  return new Set(me?.following?.map((f) => f.followed_user_id) ?? []);
};

export const useProfile = (username?: string) =>
  useQuery({
    queryKey: userKeys.profile(username ?? ""),
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/${username}`);
      return data;
    },
    enabled: !!username,
  });

export const CONNECTIONS_PAGE_SIZE = 10;

/** Followers/following of a profile, paginated ("Carregar mais"). */
export const useConnections = (
  username: string | undefined,
  type: "followers" | "following",
  enabled = true,
) =>
  useInfiniteQuery({
    queryKey: userKeys.connections(username ?? "", type),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<UserSummary[]>(`/users/${username}/connections`, {
        params: { type, page: pageParam, limit: CONNECTIONS_PAGE_SIZE },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < CONNECTIONS_PAGE_SIZE ? undefined : allPages.length + 1,
    enabled: enabled && !!username,
  });

/** Random community members to follow. `refetch()` draws a new batch. */
export const useSuggestions = (limit: number) =>
  useQuery({
    queryKey: communityKeys.suggestions(limit),
    queryFn: async () => {
      const { data } = await api.get<UserSummary[]>("/users/explore/suggestions", {
        params: { limit },
      });
      return data;
    },
    staleTime: 5 * 60_000, // random anyway; no point re-shuffling on remount
  });

/**
 * Accumulating random-user feed for /community: each `fetchNextPage()`
 * APPENDS a fresh batch instead of reshuffling. The "page param" is the
 * list of ids already on screen, sent as `exclude` so the backend never
 * repeats anyone. A batch smaller than `batchSize` means the community
 * has been exhausted → no next page.
 */
export const useExploreUsers = (batchSize: number) =>
  useInfiniteQuery({
    queryKey: communityKeys.explore(batchSize),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<UserSummary[]>("/users/explore/suggestions", {
        params: {
          limit: batchSize,
          exclude: pageParam.length ? pageParam.join(",") : undefined,
        },
      });
      return data;
    },
    initialPageParam: [] as number[],
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < batchSize ? undefined : allPages.flat().map((user) => user.id),
    staleTime: 5 * 60_000,
  });

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isFollowing,
    }: {
      userId: number;
      isFollowing: boolean;
    }) => {
      if (isFollowing) await api.delete(`/users/${userId}/follow`);
      else await api.post(`/users/${userId}/follow`);
      return { userId, nowFollowing: !isFollowing };
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthModalStore.getState().openModal("signIn");
        return;
      }
      toast.error("Não foi possível atualizar o status de seguir.");
    },
    onSuccess: ({ nowFollowing }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(
        nowFollowing
          ? "O usuário foi seguido com sucesso!"
          : "Deixou de seguir o usuário com sucesso!",
      );
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await api.patch<User>("/users/me", data);
      return res.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateInterests = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tagIds: number[]) => {
      const res = await api.put<User>("/users/me/interests", { tagIds });
      return res.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user);
    },
  });
};
