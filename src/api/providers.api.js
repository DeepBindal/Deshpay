import api from "./axios";

export const getProvidersByCategoryApi = (category) =>
  api.get("/api/providers", {
    params: { category },
  });
