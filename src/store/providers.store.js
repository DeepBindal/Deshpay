import { create } from "zustand";
import { getProvidersByCategoryApi } from "../api/providers.api";

export const useProvidersStore = create((set, get) => ({
  providersByCategory: {}, // { electricity: [], water: [] }
  loading: false,
  error: null,

  fetchProviders: async (category, opts = { force: false }) => {
    const cached = get().providersByCategory[category];
    if (cached && !opts.force) return; // cache hit

    set({ loading: true, error: null });

    try {
      const providers = await getProvidersByCategoryApi(category);

      // ✅ model aligned: keep only active providers (optional but recommended)
      const activeProviders = (providers || []).filter(
        (p) => p.isActive !== false,
      );

      set((state) => ({
        providersByCategory: {
          ...state.providersByCategory,
          [category]: activeProviders,
        },
        loading: false,
      }));
    } catch (err) {
      set({
        error: err?.message || "Failed to load providers",
        loading: false,
      });
    }
  },

  // ✅ helper for Pay screen (uses Mongo _id)
  getProviderById: (category, providerId) => {
    const list = get().providersByCategory[category] || [];
    return list.find((p) => String(p._id) === String(providerId)) || null;
  },

  clearProviders: () =>
    set({
      providersByCategory: {},
      error: null,
    }),
}));
