import api from "../axios";

export const getAdminUsersApi = (params = {}) => {
  return api.get("/api/admin/users", { params });
};

export const toggleUserStatusApi = (userId) => {
  return api.patch(`/api/admin/users/${userId}/toggle`);
};
