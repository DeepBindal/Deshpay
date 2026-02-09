import { create } from "zustand";
import { getProvidersByCategoryApi } from "../api/providers.api";

export const useProvidersStore = create((set, get) => ({
  providersByCategory: {}, // { electricity: [], water: [] }
  loading: false,
  error: null,

  fetchProviders: async (category) => {
    const cached = get().providersByCategory[category];
    if (cached) return; // cache hit

    set({ loading: true, error: null });

    try {
      const providers = await getProvidersByCategoryApi(category);

      set((state) => ({
        providersByCategory: {
          ...state.providersByCategory,
          [category]: providers,
        },
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.message || "Failed to load providers",
        loading: false,
      });
    }
  },

  clearProviders: () =>
    set({
      providersByCategory: {},
      error: null,
    }),
}));
