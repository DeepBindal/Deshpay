import api from "../axios";

export const getAdminTransactionsApi = (params = {}) => {
  return api.get("/api/admin/transactions", { params });
};
