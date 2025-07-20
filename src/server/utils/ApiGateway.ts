import axios from "axios";
import Cookies from "js-cookie";
// Configure base URL from environment variables
// export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/v1/en/`;
export const API_BASE_URL = `${import.meta.env.VITE_API_LOCAL_URL}`;

// Create an axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store ongoing requests
const controllers = new Map<string, AbortController>();

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = Cookies.get("_UPLFMMATRIX");

    // Only add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cancel any previous request to the same endpoint
    if (config.url && controllers.has(config.url)) {
      controllers.get(config.url)?.abort();
      controllers.delete(config.url);
    }

    // Create a new AbortController and attach signal to request
    const controller = new AbortController();
    config.signal = controller.signal;
    if (config.url) controllers.set(config.url, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Remove completed requests from map
    if (response.config.url) {
      controllers.delete(response.config.url);
    }
    return response;
  },
  (error) => {
    console.log("error", error);
    // // Handle unauthorized access
    // if (error.response?.status === 401) {
    //   console.log(error);
    //   localStorage.clear();
    //   const redirectPath = encodeURIComponent(window.location.pathname);
    //   window.location.href = `/auth-login?redirect=${redirectPath}`;
    // }

    // // If request was canceled, do not show error
    // if (axios.isCancel(error)) {
    //   return Promise.resolve({ canceled: true });
    // }

    // // Format error message
    // const errorMessage =
    //   error.response?.data?.message ||
    //   error.message ||
    //   "An unexpected error occurred";
    const errorMessage = "heelo";

    return Promise.reject(errorMessage);
  }
);

// Optional: Add TypeScript interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
