import apiInstance from "./apiInstance";
import { AxiosRequestConfig, AxiosResponse } from "axios";

// ==============================
// 🔹 GENERIC REQUEST FUNCTION
// ==============================
export const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiInstance(config);
  return response.data;
};

// ==============================
// 🔹 METHODS
// ==============================

export const get = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => request<T>({ method: "GET", url, ...config });

export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => request<T>({ method: "POST", url, data, ...config });

export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => request<T>({ method: "PUT", url, data, ...config });

export const patch = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => request<T>({ method: "PATCH", url, data, ...config });

export const remove = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => request<T>({ method: "DELETE", url, ...config });


// ==============================
// 🔹 BLOB / DOWNLOAD
// ==============================

export const postBlob = async (
  url: string,
  data?: any
): Promise<AxiosResponse<Blob>> => {
  return apiInstance.post(url, data, {
    responseType: "blob",
  });
};

export const getBlob = async (url: string): Promise<Blob> => {
  const res = await apiInstance.get(url, { responseType: "blob" });
  return res.data;
};

export const downloadFile = async (
  url: string
): Promise<{ blob: Blob; headers: any }> => {
  const res = await apiInstance.get(url, { responseType: "blob" });

  return {
    blob: res.data,
    headers: res.headers,
  };
};