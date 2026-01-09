import axios, { AxiosError, AxiosInstance } from "axios";
import { OAuthTokenManager } from "../auth/OAuthTokenManager";
import { env } from "../env";

const tokenManager = new OAuthTokenManager();

export const serviceFusionClient: AxiosInstance = axios.create({
  baseURL: env.SERVICE_FUSION_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   Request interceptor (inject OAuth token)
   ============================================================ */

serviceFusionClient.interceptors.request.use(async (config) => {
  const token = await tokenManager.getAccessToken();

  // Axios v1+ headers are AxiosHeaders, not plain objects
  config.headers?.set("Authorization", `Bearer ${token}`);

  return config;
});

/* ============================================================
   Response interceptor (401 → force refresh)
   ============================================================ */

serviceFusionClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newToken = await tokenManager.forceRefresh();

      originalRequest.headers?.set("Authorization", `Bearer ${newToken}`);

      return serviceFusionClient(originalRequest);
    }

    return Promise.reject(error);
  }
);
