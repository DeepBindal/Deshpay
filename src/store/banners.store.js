import { create } from "zustand";
import { getBannersApi } from "../api/banners.api";

export const useBannersStore = create((set, get) => ({
  banners: [],
  loading: false,
  error: null,
  fetched: false, // important: avoid refetching

  fetchBanners: async () => {
    if (get().fetched) return;

    set({ loading: true, error: null });

    try {
      const banners = await getBannersApi();
      set({
        banners,
        loading: false,
        fetched: true,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to load banners",
        loading: false,
      });
    }
  },
}));
