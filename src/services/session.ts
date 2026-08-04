/**
 * "Has this browser ever been logged in?"
 *
 * The refresh token is an httpOnly cookie, so JS cannot look at it. Without a
 * hint the client cannot tell these two apart:
 *
 *   - anonymous visitor  -> 401 on /users/me is the ANSWER. Nothing to refresh.
 *   - expired session    -> 401 on /users/me is temporary. /auth/refresh fixes it.
 *
 * Treating the first case like the second is what made the landing page fire
 * /users/me -> /auth/refresh -> (401) in a loop for visitors who never had an
 * account. This flag is a hint only: it says "a refresh is worth trying", never
 * "the user is authenticated". Only /users/me decides that.
 */
const SESSION_HINT_KEY = "ct:has-session";

export function hasSessionHint(): boolean {
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === "1";
  } catch {
    // Private mode / storage disabled: no hint, so we never try to refresh.
    return false;
  }
}

export function markSessionStarted(): void {
  try {
    localStorage.setItem(SESSION_HINT_KEY, "1");
  } catch {
    /* not worth failing a login over */
  }
}

export function clearSessionHint(): void {
  try {
    localStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    /* ignore */
  }
}
