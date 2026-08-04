import { create } from "zustand";
import { queryClient, resetToSignedOut } from "../lib/queryClient";
import { userKeys } from "../queries/keys";
import { api } from "../services/api";
import { clearSessionHint, markSessionStarted } from "../services/session";
import type { AuthState } from "../types/authTypes";

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,

  clearLocalState: () => set({ isLoading: false, error: null }),

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout falhou no servidor, limpando o cliente mesmo assim.", err);
    } finally {
      // Drop every cached response so the next user never sees the previous
      // one's data (notifications, profile, likes...). resetToSignedOut keeps
      // `/me` seeded with null instead of clear()-ing it, which would make the
      // mounted useMe() observer refetch -> 401 -> refresh loop.
      clearSessionHint();
      resetToSignedOut();
      set({ isLoading: false, error: null });
    }
  },

  signIn: async (data) => {
    set({ isLoading: true, error: null });

    try {
      await api.post("/auth/login", data);
      // From now on a 401 means "expired", so /auth/refresh is worth trying.
      markSessionStarted();
      // Pull the fresh session before we report success, so the UI flips to
      // "logged in" with the user already in cache.
      await queryClient.refetchQueries({ queryKey: userKeys.me() });
    } catch (err: any) {
      const message = err.response?.data?.message || "Email ou senha inválidos.";
      set({ error: "Email ou senha inválidos." });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/register", data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Falha ao cadastrar. Tente novamente";
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/forgot-password", data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Verifique se o email está correto";
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/reset-password", data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Token inválido ou expirado.";
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
