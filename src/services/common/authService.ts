import axios from "axios";
import { authApi } from "./api";
export interface UserData {
  [key: string]: any;
}
export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: UserData;
  userData?: UserData;
}
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    const trimmed = c.trim();
    if (trimmed.startsWith(name + "=")) {
      return decodeURIComponent(trimmed.substring(name.length + 1));
    }
  }
  return null;
};
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};
const getBaseURL = () => import.meta.env.VITE_API_URL ;
const isLikelyLocalhost = () => {
  const h = window.location.hostname;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.startsWith("192.168.") ||
    h.startsWith("10.") ||
    h.endsWith(".local")
  );
};

export const authService = {

  getCurrentToken(): string | null {
    const token = getCookie("token");
    return (token && token !== "undefined" && token !== "null") ? token : null;
  },


  getRefreshToken(): string | null {
    const token = getCookie("refresh_token");
    return (token && token !== "undefined" && token !== "null") ? token : null;
  },


  getUserData(): UserData | null {
    const data = getCookie("userData");
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },


  isAuthenticated(): boolean {
    const token = this.getCurrentToken();
    const isAuth = !!token;

    // Debug logging to help identify why redirects happen
    if (!isAuth) {
      console.log("🔓 Auth Status: Not Authenticated (no valid token found)");
    } else {
      console.log("🔒 Auth Status: Authenticated");
    }

    return isAuth;
  },


  async login(payload: any): Promise<AuthResponse> {
    try {
      const baseURL = getBaseURL();

      const res = await axios.post(
        `${baseURL}${authApi.login}`,
        payload,
        {
          withCredentials: true,
        }
      );

      const data = res.data;
      console.log("✅ LOGIN RESPONSE:", data);

      // 🔥 HANDLE ALL POSSIBLE TOKEN KEYS
      const accessToken =
        data.access_token ||
        data.accessToken ||
        data.token ||
        data.data?.token ||
        data.data?.access_token ||
        data.data?.accessToken;

      const refreshToken =
        data.refresh_token ||
        data.refreshToken ||
        data.data?.refreshToken ||
        data.data?.refresh_token ||
        "";

      if (accessToken) {
        this.storeTokenData(accessToken, refreshToken);
      } else {
        console.error("❌ No access token found in response", data);
      }

      // 👤 Store user
      const user = data.user || data.userData || data.data?.user || data.data?.userData || data.data;
      if (user && typeof user === 'object') {
        const isSecure = window.location.protocol === "https:";
        const cookieStr = `userData=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=3600; SameSite=${isSecure ? 'None' : 'Lax'}; ${isSecure ? 'Secure' : ''}`;
        document.cookie = cookieStr;
      }

      return data;
    } catch (error: any) {
      console.error("❌ LOGIN ERROR:", error?.response || error);
      throw error;
    }
  },




  storeTokenData(accessToken: string, refreshToken: string): void {
    if (!accessToken) return;

    const isSecure = window.location.protocol === "https:";

    const cookieOptions = isSecure
      ? "path=/; max-age=3600; SameSite=None; Secure"
      : "path=/; max-age=3600; SameSite=Lax";

    const refreshOptions = isSecure
      ? "path=/; max-age=604800; SameSite=None; Secure"
      : "path=/; max-age=604800; SameSite=Lax";

    document.cookie = `token=${encodeURIComponent(accessToken)}; ${cookieOptions}`;
    if (refreshToken) {
      document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; ${refreshOptions}`;
    }


  },

  clearStoredData(): void {
    deleteCookie("token");
    deleteCookie("refresh_token");
    deleteCookie("userData");
  },
};