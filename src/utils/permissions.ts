import { Post } from "../types/postTypes";
import { User } from "../types/userTypes";

/**
 * Whether the given user has moderation powers over the whole platform.
 * Moderators (and admins) can delete posts from any member.
 *
 * Defensive against backend casing/variations: the role comes from `/me`.
 */
export const isModerator = (user?: User | null): boolean => {
  const role = (user?.role as string | undefined | null)?.toLowerCase();
  return role === "moderator" || role === "admin";
};

/** Only the author can edit their own post. */
export const canEditPost = (post: Post, user?: User | null): boolean =>
  !!user && post.author_id === user.id;

/** The author can delete their own post; a moderator can delete anyone's. */
export const canDeletePost = (post: Post, user?: User | null): boolean =>
  !!user && (post.author_id === user.id || isModerator(user));
