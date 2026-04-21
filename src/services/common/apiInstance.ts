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

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getCurrentToken();

    // ✅ ONLY set if not already passed manually
    if (!config.headers?.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Auth header added:", `Bearer ${token.substring(0, 10)}...`);
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

  (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Only redirect if there was a token (meaning the session actually expired)
        // If there was no token, it was a guest request and we shouldn't force login
        const hadToken = !!authService.getCurrentToken();
        if (hadToken) {
          toastError("Session expired");
          authService.logout();
        }
      } else if (status === 403) {
        toastError("No permission");
      } else {
        toastError(data?.message || "Something went wrong");
      }
    } else {
      toastError("Server not responding");
    }

    return Promise.reject(error);
  }
);

export default apiInstance;