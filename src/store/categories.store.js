import { create } from "zustand";
import { getCategoriesApi } from "../api/categories.api";

export const useCategoriesStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetched: false,

  fetchCategories: async () => {
    if (get().fetched) return;

    set({ loading: true, error: null });

    try {
      const categories = await getCategoriesApi();
      set({
        categories,
        loading: false,
        fetched: true,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to load categories",
        loading: false,
      });
    }
  },
}));
