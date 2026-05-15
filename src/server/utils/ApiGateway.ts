import axios from "axios";
import Cookies from "js-cookie";
// Local Next.js API (no external backend)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1/en/";

// Create an axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
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

    // Only dedupe/cancel in-flight GET requests (avoid aborting POST create)
    if (config.method?.toUpperCase() === "GET" && config.url) {
      if (controllers.has(config.url)) {
        controllers.get(config.url)?.abort();
        controllers.delete(config.url);
      }
      const controller = new AbortController();
      config.signal = controller.signal;
      controllers.set(config.url, controller);
    }

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
    // console.log("error", error);
    // Handle unauthorized access
    console.log("error", error);
    if (error.response?.status === 401) {
      console.log(error);
      localStorage.clear();
      // const redirectPath = encodeURIComponent(window.location.pathname);
      // window.location.href = `/login`;
    }

    // Let React Query retry when a duplicate GET aborts the previous request
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // // Format error message
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    // const errorMessage = "heelo";
    console.log("errror message", errorMessage);
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
