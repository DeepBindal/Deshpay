import { create } from "zustand";
import { getAdminTransactionsApi } from "../../api/admin/transactions.api";

export const useAdminTransactionsStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,
  filters: {
    status: "",
    from: "",
    to: "",
    userId: "",
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  clearFilters: () =>
    set({
      filters: {
        status: "",
        from: "",
        to: "",
        userId: "",
      },
    }),

  fetchTransactions: async () => {
    set({ loading: true, error: null });

    try {
      const { filters } = useAdminTransactionsStore.getState();

      // remove empty filters
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v),
      );

      const txns = await getAdminTransactionsApi(params);

      set({
        transactions: txns,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to load transactions",
        loading: false,
      });
    }
  },
}));
