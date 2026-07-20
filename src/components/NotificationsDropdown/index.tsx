import React from "react";
import { ClipLoader } from "react-spinners";
import { Notification } from "../../types/notificationTypes";
import { getNotificationMessage } from "../../utils/notificationMessage";

interface NotificationsDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="NotificationsDropdown" role="menu">
      <div className="NotificationsDropdownHeader">
        <h3>Notificações</h3>
        {hasUnread && (
          <button
            type="button"
            className="NotificationsMarkAll"
            onClick={onMarkAllAsRead}
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="NotificationsDropdownEmpty">
          <ClipLoader color="#2DBA4F" size={18} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="NotificationsDropdownEmpty">
          <p>Você não tem notificações.</p>
        </div>
      ) : (
        <ul className="NotificationsList">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                className={`NotificationItem ${
                  notification.read ? "is-read" : "is-unread"
                }`}
                onClick={() =>
                  !notification.read && onMarkAsRead(notification.id)
                }
                disabled={notification.read}
              >
                <span className="NotificationDot" />
                <p>{getNotificationMessage(notification)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
