import api from "./axios";

export const getBannersApi = () => {
  return api.get("/api/banners");
};
