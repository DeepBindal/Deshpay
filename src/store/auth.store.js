import { create } from "zustand";
import { loginApi, signupApi, meApi } from "../api/auth.api";
import { useTransactionsStore } from "./transactions.store";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const user = await meApi();
      set({ user, loading: false });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, loading: false });
    }
  },

  login: async (payload) => {
    const res = await loginApi(payload);
    localStorage.setItem("token", res.token);
    set({ user: res.user });
  },

  signup: async (payload) => {
    const res = await signupApi(payload);
    localStorage.setItem("token", res.token);
    set({ user: res.user });
  },

  logout: () => {
    localStorage.removeItem("token");
    useTransactionsStore.getState().clearTransactions();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
