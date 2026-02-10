import api from "../axios";

export const getAdminProvidersApi = (params = {}) => {
  return api.get("/api/admin/providers", { params });
};

export const toggleProviderApi = (providerId) => {
  return api.patch(`/api/admin/providers/${providerId}/toggle`);
};

export const updateProviderApi = (providerId, payload) => {
  return api.patch(`/api/admin/providers/${providerId}`, payload);
};

export const createProviderApi = (payload) => {
  return api.post(`/api/admin/providers`, payload);
};
