import { create } from "zustand";
import { Post } from "../types/postTypes";

/**
 * Client state only: the post/question being drafted in the editor.
 *
 * Server state (lists, details, likes, mutations) lives in React Query — see
 * `src/queries/posts.ts`. Keeping server data here is what forced the manual
 * isLoading/error bookkeeping and made every navigation refetch from scratch.
 */
interface PostDraftState {
  title: string;
  body: any;
  kind: "article" | "question" | "answer";
  isEditMode: boolean;
  editingPostId: number | null;

  setTitle: (title: string) => void;
  setBody: (body: any) => void;
  setKind: (kind: "article" | "question" | "answer") => void;
  loadPostForEdit: (post: Post) => void;
  reset: () => void;
}

const initialDraft = {
  title: "",
  body: {} as any,
  kind: "question" as const,
  isEditMode: false,
  editingPostId: null,
};

export const usePostStore = create<PostDraftState>((set) => ({
  ...initialDraft,

  setTitle: (title) => set({ title }),
  setBody: (body) => set({ body }),
  setKind: (kind) => set({ kind }),

  loadPostForEdit: (post) =>
    set({
      title: post.title || "",
      body: post.body,
      kind: post.kind,
      isEditMode: true,
      editingPostId: post.id,
    }),

  reset: () => set({ ...initialDraft }),
}));
