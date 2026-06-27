// Auth server functions — callable from client components
import { createServerFn } from "@tanstack/react-start";
import { signIn, setupAdmin, createEmployee, hasUsers, getUserFromToken } from "./auth.server";

export const signInFn = createServerFn({ method: "POST" })
  .validator(
    (data: { email: string; password: string }) => data,
  )
  .handler(async ({ data }) => {
    const result = await signIn(data.email, data.password);
    const userInfo = await getUserFromToken(result.token);
    return {
      token: result.token,
      user: userInfo?.user ?? null,
      profile: userInfo?.profile ?? null,
      role: userInfo?.role ?? null,
    };
  });

export const hasUsersFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return await hasUsers();
  });

export const setupAdminFn = createServerFn({ method: "POST" })
  .validator(
    (data: { email: string; password: string; fullName: string }) => data,
  )
  .handler(async ({ data }) => {
    const result = await setupAdmin(data.email, data.password, data.fullName);
    const userInfo = await getUserFromToken(result.token);
    return {
      token: result.token,
      user: userInfo?.user ?? null,
      profile: userInfo?.profile ?? null,
      role: userInfo?.role ?? null,
    };
  });

export const createEmployeeFn = createServerFn({ method: "POST" })
  .validator(
    (data: { email: string; password: string; fullName: string; token: string }) => data,
  )
  .handler(async ({ data }) => {
    const userInfo = await getUserFromToken(data.token);
    if (!userInfo || userInfo.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create employees");
    }
    await createEmployee(data.email, data.password, data.fullName);
    return { success: true };
  });

export const getMeFn = createServerFn({ method: "GET" })
  .validator(
    (data: { token: string }) => data,
  )
  .handler(async ({ data }) => {
    if (!data.token) return null;
    const userInfo = await getUserFromToken(data.token);
    if (!userInfo) return null;
    return {
      user: userInfo.user,
      profile: userInfo.profile,
      role: userInfo.role,
    };
  });
