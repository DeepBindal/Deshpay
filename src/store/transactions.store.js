import { create } from "zustand";
import { getMyTransactionsApi } from "../api/transactions.api";

export const useTransactionsStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });

    try {
      const txns = await getMyTransactionsApi();
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

  clearTransactions: () => {
    set({
      transactions: [],
      loading: false,
      error: null,
    });
  },
}));
