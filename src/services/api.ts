import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
  } from "axios";

const resolvedBaseUrl =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'https://phpstack-1497927-5868931.cloudwaysapps.com/api/v1';
    
if (!resolvedBaseUrl) {
  console.warn(
    "API baseURL is not defined. Set NEXT_PUBLIC_BASE_URL for client and BASE_URL for server."
  );
}
  
  // Create a custom axios instance
  const axiosInstance = axios.create({
    baseURL: resolvedBaseUrl,
    timeout: 50000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        try {
          token = localStorage.getItem('token');
        } catch (error) {
          console.warn('Failed to access localStorage:', error);
        }
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add Accept-Language header
      let locale: string = 'en'; // default locale
      if (typeof window !== 'undefined') {
        try {
          // Try to get locale from localStorage first
          const storedLocale = localStorage.getItem('NEXT_LOCALE');
          // console.log("==> API storedLocale", storedLocale);
          
          if (storedLocale && ['en', 'ar'].includes(storedLocale)) {
            locale = storedLocale;
            // console.log("==> Using stored locale:", locale);
          } else {
            // Fallback to browser language detection
            const browserLang = navigator.language.split('-')[0];
            locale = ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
            // console.log("==> Using browser/fallback locale:", locale);
          }
        } catch (error) {
          console.warn('Failed to access localStorage or navigator:', error);
          locale = 'en'; // fallback to default
        }
      }
      config.headers['Accept-Language'] = locale;
      // console.log("==> Setting Accept-Language header:", locale);

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