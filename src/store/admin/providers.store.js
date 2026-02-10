import { create } from "zustand";
import {
  createProviderApi,
  getAdminProvidersApi,
  toggleProviderApi,
  updateProviderApi,
} from "../../api/admin/providers.api";

export const useAdminProvidersStore = create((set) => ({
  providers: [],
  loading: false,
  error: null,
  editingProvider: null, // for edit modal

  fetchProviders: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const providers = await getAdminProvidersApi(params);
      set({ providers, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to load providers",
        loading: false,
      });
    }
  },

  toggleProvider: async (providerId) => {
    try {
      await toggleProviderApi(providerId);
      set((state) => ({
        providers: state.providers.map((p) =>
          p._id === providerId ? { ...p, isActive: !p.isActive } : p,
        ),
      }));
    } catch (err) {
      alert(err.message || "Failed to update provider");
    }
  },

  openEdit: (provider) => set({ editingProvider: provider }),
  closeEdit: () => set({ editingProvider: null }),
  saveProvider: async (providerId, payload) => {
    try {
      const updated = await updateProviderApi(providerId, payload);

      set((state) => ({
        providers: state.providers.map((p) =>
          p._id === providerId ? updated : p,
        ),
        editingProvider: null,
      }));
    } catch (err) {
      alert(err.message || "Failed to save provider");
    }
  },
}));
