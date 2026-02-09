import api from "./axios";

export const getMyTransactionsApi = () => {
  return api.get("/api/transactions");
};
