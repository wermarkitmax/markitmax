import { useEffect, useState, useCallback } from "react";
import { getToken, clearToken } from "@/lib/auth-token";
import { getMeFn } from "@/lib/auth.functions";

export type AppRole = "admin" | "employee";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}

export interface AuthState {
  loading: boolean;
  session: { access_token: string } | null;
  user: AuthUser | null;
  role: AppRole | null;
  profile: { full_name: string | null; email: string | null; avatar_url: string | null } | null;
}

export function useAuth(): AuthState & { signOut: () => Promise<void> } {
  const [state, setState] = useState<AuthState>({
    loading: true, session: null, user: null, role: null, profile: null,
  });

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState({ loading: false, session: null, user: null, role: null, profile: null });
      return;
    }

    try {
      const result = await getMeFn({ data: { token } });
      if (!result) {
        clearToken();
        setState({ loading: false, session: null, user: null, role: null, profile: null });
        return;
      }

      setState({
        loading: false,
        session: { access_token: token },
        user: result.user as AuthUser,
        role: result.role as AppRole,
        profile: result.profile as AuthState["profile"],
      });
    } catch {
      clearToken();
      setState({ loading: false, session: null, user: null, role: null, profile: null });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const signOut = async () => {
    clearToken();
    setState({ loading: false, session: null, user: null, role: null, profile: null });
  };

  return { ...state, signOut };
}
