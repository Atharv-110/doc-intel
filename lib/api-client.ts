import axios, { InternalAxiosRequestConfig } from "axios";

// Custom Error Class to normalize errors across the app
export class ApiError extends Error {
  public code: string;
  public status?: number;

  constructor(message: string, code = "UNKNOWN_ERROR", status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// Main API Client
export const apiClient = axios.create({
  timeout: 60000,
});

// Request Interceptor: Attach API Key
const authInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const key = localStorage.getItem("pageindex_api_key");
    if (key) {
      config.headers.Authorization = `Bearer ${key}`;
    }
  }
  return config;
};

apiClient.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error),
);

// Response Interceptor: Standardize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      let message =
        data?.message ||
        data?.error ||
        error.message ||
        "An unexpected error occurred.";
      let code = data?.code || "API_ERROR";

      if (status === 401) {
        message = "Unauthorized. Please check your API key.";
        code = "UNAUTHORIZED";
      } else if (status === 404) {
        code = "NOT_FOUND";
      }

      throw new ApiError(message, code, status);
    }

    // Non-Axios errors (network down, etc.)
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error",
      "NETWORK_ERROR",
    );
  },
);

// Separate client for streaming (requires fetch adapter in browser to stream chunks)
export const streamClient = axios.create({
  adapter: "fetch",
  responseType: "stream",
});

// Attach the same request interceptor for auth
streamClient.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error),
);
