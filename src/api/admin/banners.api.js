import api from "../axios";

export const getAdminBannersApi = () => {
  return api.get("/api/admin/banners");
};

export const createBannerApi = (formData) => {
  return api.post("/api/admin/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateBannerApi = (id, payload) => {
  return api.patch(`/api/admin/banners/${id}`, payload);
};

export const toggleBannerApi = (id) => {
  return api.patch(`/api/admin/banners/${id}/toggle`);
};

export const reorderBannersApi = (orders) => {
  return api.patch("/api/admin/banners/reorder", { orders });
};
