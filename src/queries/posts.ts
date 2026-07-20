import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../services/api";
import { postKeys } from "./keys";
import { Post, PostFilters, PostListResponse } from "../types/postTypes";

const buildParams = (filters: PostFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.kind) params.append("kind", filters.kind);
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.page) params.append("page", String(filters.page));
  if (filters.author_id) params.append("author_id", String(filters.author_id));
  if (filters.parent_id) params.append("parent_id", String(filters.parent_id));
  if (filters.tags?.length) params.append("tags", filters.tags.join(","));
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.q) params.append("q", filters.q);
  return params;
};

export const fetchPosts = async (
  filters: PostFilters,
): Promise<PostListResponse> => {
  const { data } = await api.get(`/posts?${buildParams(filters).toString()}`);
  return {
    data: data?.data ?? [],
    pagination: data?.pagination ?? null,
  };
};

export const fetchPostById = async (id: string | number): Promise<Post> => {
  const { data } = await api.get(`/posts/${id}`);
  return data;
};

/** Paginated/filtered post list. Keeps the previous page visible while the
 *  next one loads, so paging doesn't flash a skeleton. */
export const usePosts = (filters: PostFilters, enabled = true) =>
  useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
    placeholderData: keepPreviousData,
    enabled,
  });

export const usePost = (id?: string) =>
  useQuery({
    queryKey: postKeys.detail(id ?? ""),
    queryFn: () => fetchPostById(id as string),
    enabled: !!id,
  });

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/posts/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      kind: "question" | "article" | "answer";
      title?: string;
      body: unknown;
      parent_id?: number;
    }) => {
      const { data } = await api.post("/posts", payload);
      return data as Post;
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      // An answer changes its parent question's detail view.
      if (post?.parent_id)
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(post.parent_id),
        });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Post> }) => {
      const res = await api.put(`/posts/${id}`, data);
      return res.data as Post;
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
      if (post?.parent_id)
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(post.parent_id),
        });
    },
  });
};

/** Optimistic like toggle — the UI flips instantly instead of waiting ~2s. */
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await api.post(`/posts/${postId}/like`);
      return data as { liked: boolean; likeCount: number };
    },
    onMutate: async (postId) => {
      const key = postKeys.detail(postId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Post>(key);

      if (previous) {
        const liked = !previous.isLikedByUser;
        queryClient.setQueryData<Post>(key, {
          ...previous,
          isLikedByUser: liked,
          likeCount: (previous.likeCount ?? 0) + (liked ? 1 : -1),
        });
      }
      return { previous, key };
    },
    onError: (_err, _postId, context) => {
      if (context?.previous)
        queryClient.setQueryData(context.key, context.previous);
    },
    onSuccess: (result, postId) => {
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old
          ? {
              ...old,
              isLikedByUser: result.liked,
              likeCount: result.likeCount,
            }
          : old,
      );
    },
  });
};

export const useAcceptAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      questionId,
      answerId,
    }: {
      questionId: number;
      answerId: number;
    }) => {
      await api.post(`/posts/${questionId}/accept-answer/${answerId}`);
      return { questionId, answerId };
    },
    onSuccess: ({ questionId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(questionId) });
    },
  });
};
