import axios from "axios";

// ==============================
// 🔹 TYPES
// ==============================
export interface UserData {
  [key: string]: any;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  userData?: UserData;
}

// ==============================
// 🔹 COOKIE HELPERS
// ==============================

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const deleteAllCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
  });
};

// ==============================
// 🔹 AUTH SERVICE
// ==============================

export const authService = {
  // 🔐 Get token from cookie
  getCurrentToken(): string | null {
    return getCookie("token"); // 👉 change name if different
  },

  // 👤 Get user data (optional)
  getUserData(): UserData | null {
    const data = getCookie("userData");
    return data ? JSON.parse(data) : null;
  },

  // 🔐 Check login
  isAuthenticated(): boolean {
    return !!this.getCurrentToken();
  },

  // 🚀 Login (API call)
  async login(payload: any): Promise<AuthResponse> {
    const baseURL = import.meta.env.VITE_API_URL;

    const res = await axios.post(`${baseURL}/login`, payload);

    // ⚠️ Backend should set cookies (httpOnly recommended)
    return res.data;
  },

  // 🚪 Logout
  logout(): void {
    deleteAllCookies();

    // redirect to login
    window.location.href = "/login";
  },

  // 🔐 Get refresh token from cookie
  getRefreshToken(): string | null {
    return getCookie("refresh_token");
  },

  // 📦 Store token data in cookies
  storeTokenData(accessToken: string, refreshToken: string): void {
    document.cookie = `token=${accessToken};path=/;max-age=3600`; // 1 hour
    document.cookie = `refresh_token=${refreshToken};path=/;max-age=604800`; // 7 days
  },

  // 🗑️ Clear all stored auth data
  clearStoredData(): void {
    deleteAllCookies();
  },
};