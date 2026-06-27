// Server-side middleware: validates JWT and attaches userId to context
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { verifyJwt } from "./auth.server";

export const requireAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();

    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: No valid authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    try {
      const payload = verifyJwt(token);
      return next({
        context: {
          userId: payload.sub,
        },
      });
    } catch {
      throw new Error("Unauthorized: Invalid token");
    }
  },
);
