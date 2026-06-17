import { create } from "zustand";

export interface CloudUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  resumeCount: number;
}

interface AuthState {
  user: CloudUser | null;
  loading: boolean;
  loaded: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  loaded: false,

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/me");
      if (!res.ok) { set({ user: null, loaded: true }); return; }
      const data = await res.json() as { user: CloudUser | null };
      set({ user: data.user, loaded: true });
    } catch {
      set({ user: null, loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
    window.location.href = "/";
  },
}));
