import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from "axios";
import { BASE_URL } from '@/constants';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Export custom API methods
export const api = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<TResponse>(url, config),

  post: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ) => axiosInstance.post<TResponse>(url, data, config),

  put: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ) => axiosInstance.put<TResponse>(url, data, config),

  patch: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ) => axiosInstance.patch<TResponse>(url, data, config),

  delete: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<TResponse>(url, config),
};
