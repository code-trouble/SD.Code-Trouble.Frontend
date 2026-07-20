export type NotificationType = "post_deleted_by_moderator";

export interface PostDeletedByModeratorData {
  postTitle: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  data: PostDeletedByModeratorData;
  read?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasFetched: boolean;

  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}
