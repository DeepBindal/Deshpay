import { create } from "zustand";
import {
  getAdminBannersApi,
  createBannerApi,
  toggleBannerApi,
  reorderBannersApi,
} from "../../api/admin/banners.api";

export const useAdminBannersStore = create((set, get) => ({
  banners: [],
  loading: false,
  error: null,

  fetchBanners: async () => {
    set({ loading: true, error: null });
    try {
      const banners = await getAdminBannersApi();
      set({ banners, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to load banners",
        loading: false,
      });
    }
  },

  createBanner: async (formData) => {
    await createBannerApi(formData);
    await get().fetchBanners();
  },

  toggleBanner: async (id) => {
    await toggleBannerApi(id);
    set((state) => ({
      banners: state.banners.map((b) =>
        b._id === id ? { ...b, isActive: !b.isActive } : b,
      ),
    }));
  },

  reorderBanners: async (newOrder) => {
    set({ banners: newOrder });

    await reorderBannersApi(
      newOrder.map((b, index) => ({
        id: b._id,
        order: index,
      })),
    );
  },
}));
