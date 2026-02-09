import api from "./axios";

export const getCategoriesApi = () => {
  return api.get("/api/categories");
};
