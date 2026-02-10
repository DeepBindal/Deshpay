import { create } from "zustand";
import {
  getAdminUsersApi,
  toggleUserStatusApi,
} from "../../api/admin/users.api";

export const useAdminUsersStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const users = await getAdminUsersApi(params);
      set({ users, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to load users",
        loading: false,
      });
    }
  },

  toggleUser: async (userId) => {
    try {
      await toggleUserStatusApi(userId);

      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, isActive: !u.isActive } : u,
        ),
      }));
    } catch (err) {
      alert(err.message || "Failed to update user");
    }
  },
}));
