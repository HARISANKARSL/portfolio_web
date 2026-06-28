import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./authService";

// ==============================
// 🔔 TOAST (TEMP)
// ==============================
const toastError = (msg: string) => console.error("🔴", msg);
const toastSuccess = (msg: string) => console.log("✅", msg);

// ==============================
// CONFIG
// ==============================
export const baseURL: string =
  import.meta.env.VITE_API_URL || "https://portfolio-backend-1-bsic.onrender.com/api/";

const apiInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ for cookies
});

// Queue for replaying pending requests while token is refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getCurrentToken();

    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        if (!config.headers) {
          config.headers = {} as any;
        }
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      console.log("🔑 Auth header added successfully:", `Bearer ${token.substring(0, 10)}...`);
    }

    if (!navigator.onLine) {
      toastError("No internet connection");
      return Promise.reject(new Error("Offline"));
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ==============================
// 📩 RESPONSE INTERCEPTOR
// ==============================
apiInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.data?.message && response.data?.is_show) {
      toastSuccess(response.data.message);
    }
    return response;
  },

  async (error: AxiosError<any>) => {
    const originalRequest = error.config;

    // Check if error is 401 and the request hasn't been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry
    ) {
      // Don't attempt to refresh if the request was to login or refresh itself
      if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return apiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await authService.refreshToken();
        if (newAccessToken) {
          isRefreshing = false;
          processQueue(null, newAccessToken);

          if (originalRequest.headers && newAccessToken !== "cookie") {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
          return apiInstance(originalRequest);
        } else {
          throw new Error("Failed to get new access token");
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        toastError("Session expired. Please log in again.");
        authService.clearStoredData();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Standard non-401 error handling
    if (error.response) {
      const { status, data } = error.response;
      if (status === 403) {
        toastError("No permission");
      } else if (status !== 401) {
        toastError(data?.message || "Something went wrong");
      }
    } else {
      toastError("Server not responding");
    }

    return Promise.reject(error);
  }
);

export default apiInstance;