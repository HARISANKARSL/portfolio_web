import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./authService";

// ==============================
// 🔔 TOAST UTILITIES
// ==============================
const toastError = (message: string, options?: any) => {
  console.error("🔴 [API Error]:", message);
};

const toastSuccess = (message: string, options?: any) => {
  console.log("✅ [API Success]:", message);
};

// ==============================
// 🔐 API ENDPOINTS
// ==============================
const AuthApi = {
  authLogin: "/auth/login",
  duplicateCheck: "/auth/check",
};

// ==============================
// 🚪 LOGOUT HANDLER
// ==============================
const Logout = () => {
  authService.logout();
};




// ✅ Base URL
export const baseURL: string =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// ✅ Axios instance
const apiInstance: AxiosInstance = axios.create({
  baseURL,
});

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getCurrentToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (response.data?.message !== "Token Verified Successfully") {
      if (
        response.config.url !== AuthApi.duplicateCheck &&
        response.config.url !== AuthApi.authLogin
      ) {
        handleSuccess(response);
      }
    }
    return response;
  },

  async (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data, config } = error.response;

      // 🔁 Refresh Token Flow
      if (status === 401 && config?.url !== AuthApi.authLogin) {
        try {
          const refreshToken = authService.getRefreshToken();

          if (!refreshToken) {
            authService.clearStoredData();
            return Promise.reject("Session expired");
          }

          const tokenRes = await axios.post(
            `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/token`,
            new URLSearchParams({
              client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
              grant_type: "refresh_token",
              refresh_token: refreshToken,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const { access_token, refresh_token } = tokenRes.data;

          authService.storeTokenData(access_token, refresh_token);

          if (config.headers) {
            config.headers.Authorization = `Bearer ${access_token}`;
          }

          return axios(config);
        } catch (err) {
          authService.clearStoredData();
          handleServerErrors("Session expired. Login again.");
          return Promise.reject(err);
        }
      }

      // 🚫 403
      if (status === 403) {
        handleServerErrors("No permission");
        Logout();
      }

      // ❌ Other errors
      handleServerErrors(data?.message || "Something went wrong");
    } else {
      handleServerErrors("Server not responding");
    }

    return Promise.reject(error);
  }
);

// ==============================
// 🔔 TOAST HANDLERS
// ==============================

const shownErrors = new Set<string>();

function handleServerErrors(message?: string) {
  const msg = message || "Server Error";

  if (shownErrors.has(msg)) return;

  shownErrors.add(msg);

  toastError(msg, {
    className: "custom-toast-width",
    life: 4000,
    onClose: () => shownErrors.delete(msg),
  });
}

function handleSuccess(response: AxiosResponse<any>) {
  const { data } = response;

  if (!data?.is_show) return;

  toastSuccess(data.message, {
    className: "custom-toast-width",
    life: 4000,
  });
}

export default apiInstance;