import api from "./axios";

export const loginApi = (payload) => api.post("/api/auth/login", payload);

export const signupApi = (payload) => api.post("/api/auth/signup", payload);

export const meApi = () => api.get("/api/auth/me");
