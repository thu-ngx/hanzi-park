import { useAuthStore } from "@/features/auth/store/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

// add accessToken to request header
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// auto call refresh when accessToken expired (403) and still logged in
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // skip auth endpoints
    if (
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retryCount) {
      originalRequest._retryCount = true;
      console.log("Retry refresh");

      try {
        const res = await api.post("/auth/refresh", { withCredentials: true });

        const newAccessToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);

        // attach new accessToken to headers of original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    // other error status
    return Promise.reject(error);
  },
);

export default api;
