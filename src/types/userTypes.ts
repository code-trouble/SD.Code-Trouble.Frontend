interface InterestTag {
  id: number;
  name: string;
}

interface UserInterest {
  user_id: number;
  tag_id: number;
  tag: InterestTag;
}

export type UserRole = "member" | "moderator" | "admin";

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  role?: UserRole | null;
  display_name: string | null;
  pronouns: string | null;
  bio: string | null;
  avatar_url: string;
  banner_url: string | null;
  social_links: {
    linkedin?: string;
    github?: string;
    dribbble?: string;
    behance?: string;
  } | null;

  user_interests: UserInterest[];

  following?: { followed_user_id: number }[];

  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}

/** Compact user shape returned by connections/suggestions endpoints. */
export interface UserSummary {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  pronouns: string | null;
}

export type UpdateProfileData = Partial<{
  display_name: string;
  pronouns: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  social_links: {
    linkedin?: string;
    github?: string;
    dribbble?: string;
    behance?: string;
  };
}>;

export interface UserState {
  currentUser: User | null;
  isInitializing: boolean;
  profileUser: User | null;
  isLoadingProfile: boolean;

  updatingFollowStatus: Set<number>;
  isUpdatingFollowStatus: (userId: number) => boolean;

  fetchCurrentUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateUserInterests: (tagIds: number[]) => Promise<void>;
  clearUser: () => void;
  setUser: (user: User) => void;
  followingUsers: Set<number>;
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  isFollowingUser: (userId: number) => boolean;

  fetchUserProfile: (username: string) => Promise<User>;
  clearProfileUser: () => void;
}
