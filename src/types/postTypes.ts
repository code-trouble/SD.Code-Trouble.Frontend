export interface Post {
  id: number;
  title: string;
  body: any;
  kind: "article" | "question" | "answer";
  created_at: string;
  updated_at?: string;
  author_id: number;
  parent_id?: number;
  author: {
    id: number;
    username: string;
    display_name?: string;
    avatar_url: string;
  };
  commentCount?: number;
  likeCount?: number;
  answerCount?: number;
  isLikedByUser?: boolean;
  tags?: { id: number; name: string }[];

  answers?: Post[];
  acceptedAnswerId?: number;
  isAccepted?: boolean;
}

export type PostSort = "newest" | "oldest" | "top";

export interface PostFilters {
  kind?: "article" | "question" | "answer";
  limit?: number;
  page?: number;
  author_id?: number;
  parent_id?: number;
  /** Tag names — backend matches posts having ANY of them. */
  tags?: string[];
  sort?: PostSort;
  /** Case-insensitive search on the title. */
  q?: string;
}

export interface PostListResponse {
  data: Post[];
  pagination: PostPagination;
}

export interface PostPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostState {
  title: string;
  body: any;
  kind: "article" | "question" | "answer";
  isLoading: boolean;
  error: string | null;
  success: boolean;
  isEditMode: boolean;
  editingPostId: number | null;
  isLiking: boolean;

  questionsList: Post[];
  articlesList: Post[];
  answersList: Post[];
  userPosts: Post[];
  currentPost: Post | null;
  isLoadingPosts: boolean;
  isLoadingAnswer: boolean;
  pagination: PostPagination | null;

  setTitle: (title: string) => void;
  setBody: (body: any) => void;
  setKind: (kind: "article" | "question" | "answer") => void;
  reset: () => void;
  clearPosts: () => void;

  createPost: (overrides?: {
    kind?: "question" | "article" | "answer";
    title?: string;
    body?: any;
    parent_id?: number;
  }) => Promise<Post>;

  updatePost: (id: number, data: Partial<Post>) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
  fetchAllPosts: (filters?: PostFilters) => Promise<void>;
  fetchPostById: (id: string) => Promise<Post>;
  fetchUserPosts: (
    userId: number,
    kind?: "article" | "question" | "answer",
  ) => Promise<void>;
  toggleLike: (postId: number) => Promise<any>;
  loadPostForEdit: (post: Post) => void;
  isPostOwner: (post: Post, currentUserId?: number) => boolean;

  createAnswer: (questionId: number, body: any) => Promise<Post>;
  acceptAnswer: (questionId: number, answerId: number) => Promise<void>;
}
