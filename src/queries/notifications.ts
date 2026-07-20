import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { notificationKeys } from "./keys";
import { Notification } from "../types/notificationTypes";

interface NotificationListResponse {
  data: Notification[];
  unreadCount: number;
}

/** Light poll for the bell badge — only the count, not the whole list. */
export const useUnreadCount = (enabled: boolean) =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const { data } = await api.get("/notifications/unread-count");
      return (data?.unreadCount as number) ?? 0;
    },
    enabled,
    staleTime: 60_000,
  });

/** The full list — only fetched when the dropdown is actually opened. */
export const useNotifications = (enabled: boolean) =>
  useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async (): Promise<NotificationListResponse> => {
      const { data } = await api.get("/notifications");
      const list: Notification[] = Array.isArray(data)
        ? data
        : (data?.data ?? []);
      return {
        data: list,
        unreadCount:
          typeof data?.unreadCount === "number"
            ? data.unreadCount
            : list.filter((n) => !n.read).length,
      };
    },
    enabled,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/notifications/${id}/read`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const prevList = queryClient.getQueryData<NotificationListResponse>(
        notificationKeys.list(),
      );
      const prevCount = queryClient.getQueryData<number>(
        notificationKeys.unreadCount(),
      );

      if (prevList) {
        queryClient.setQueryData<NotificationListResponse>(
          notificationKeys.list(),
          {
            data: prevList.data.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
            unreadCount: Math.max(0, prevList.unreadCount - 1),
          },
        );
      }
      queryClient.setQueryData<number>(notificationKeys.unreadCount(), (c) =>
        Math.max(0, (c ?? 0) - 1),
      );

      return { prevList, prevCount };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prevList)
        queryClient.setQueryData(notificationKeys.list(), ctx.prevList);
      if (ctx?.prevCount !== undefined)
        queryClient.setQueryData(
          notificationKeys.unreadCount(),
          ctx.prevCount,
        );
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const prevList = queryClient.getQueryData<NotificationListResponse>(
        notificationKeys.list(),
      );
      const prevCount = queryClient.getQueryData<number>(
        notificationKeys.unreadCount(),
      );

      if (prevList) {
        queryClient.setQueryData<NotificationListResponse>(
          notificationKeys.list(),
          {
            data: prevList.data.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          },
        );
      }
      queryClient.setQueryData(notificationKeys.unreadCount(), 0);

      return { prevList, prevCount };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prevList)
        queryClient.setQueryData(notificationKeys.list(), ctx.prevList);
      if (ctx?.prevCount !== undefined)
        queryClient.setQueryData(
          notificationKeys.unreadCount(),
          ctx.prevCount,
        );
    },
  });
};
