import { Notification } from "../types/notificationTypes";

/**
 * Builds the human-readable message for a notification.
 * Currently the platform only emits `post_deleted_by_moderator`, but new
 * types can be handled by adding cases here.
 */
export const getNotificationMessage = (notification: Notification): string => {
  switch (notification.type) {
    case "post_deleted_by_moderator": {
      const title = notification.data?.postTitle;
      return title
        ? `Seu post "${title}" foi removido por um moderador.`
        : "Um dos seus posts foi removido por um moderador.";
    }
    default:
      return "Você tem uma nova notificação.";
  }
};
