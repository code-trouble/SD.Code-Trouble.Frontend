import { resetToSignedOut } from "../lib/queryClient";
import { useAuthModalStore } from "../stores/authModalStore";
import { api } from "./api";
import { clearSessionHint, hasSessionHint } from "./session";

type FailedRequest = {
  onSuccess: () => void;
  onFailure: (error: Error) => void;
};

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

/**
 * A 401 from these endpoints is a final answer, never "token expired":
 * - refresh:        refreshing after a failed refresh would recurse
 * - login/register: wrong credentials, not an expired session
 * - logout:         session already gone, which is what we wanted anyway
 */
const NO_REFRESH_URLS = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/logout"];

export function initApiLayer() {
  const resId = api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !NO_REFRESH_URLS.includes(originalRequest.url)) {
        // Anonymous visitor (never logged in on this browser): there is no
        // refresh cookie to use, so the 401 IS the answer. Reject and let the
        // caller handle it (fetchMe maps it to `null`). Trying to refresh here
        // is what used to hammer the backend from the landing page.
        if (!hasSessionHint()) {
          return Promise.reject(error);
        }

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
          failedRequestsQueue.forEach((promise) => promise.onFailure(err as Error));
          failedRequestsQueue = [];

          // The refresh cookie is dead — stop trying it on future 401s.
          clearSessionHint();
          resetToSignedOut();

          // Session genuinely expired mid-visit: ask the user to sign back in,
          // but never stomp a modal they already have open (e.g. sign-up).
          const modal = useAuthModalStore.getState();
          if (!modal.isOpen) modal.openModal("signIn");

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
