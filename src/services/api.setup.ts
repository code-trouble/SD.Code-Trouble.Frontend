import { useAuthModalStore } from "../stores/authModalStore";
import { api } from "./api";
import { queryClient } from "../lib/queryClient";
import { userKeys } from "../queries/keys";

type FailedRequest = {
  onSuccess: () => void;
  onFailure: (error: Error) => void;
};

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

export function initApiLayer() {
  const resId = api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest.url !== "/auth/refresh"
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: () => resolve(api(originalRequest)),
              onFailure: (err) => reject(err),
            });
          });
        }

        isRefreshing = true;

        try {
          await api.post("/auth/refresh");
          failedRequestsQueue.forEach((promise) => promise.onSuccess());
          failedRequestsQueue = [];
          return api(originalRequest);
        } catch (err) {
          failedRequestsQueue.forEach((promise) =>
            promise.onFailure(err as Error),
          );
          failedRequestsQueue = [];

          useAuthModalStore.getState().openModal("signIn");
          queryClient.setQueryData(userKeys.me(), null);
          queryClient.clear();

          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return () => {
    api.interceptors.response.eject(resId);
  };
}
