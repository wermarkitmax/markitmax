// Client-side middleware: attaches JWT token to all server function calls
import { createMiddleware } from "@tanstack/react-start";
import { createIsomorphicFn } from "@tanstack/react-start";

const getTokenSafe = createIsomorphicFn()
  .client(() => {
    const TOKEN_KEY = "markitmax_auth_token";
    return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  })
  .server(() => null);

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const token = getTokenSafe();
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
