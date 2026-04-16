import axios from 'axios';
import { normalizeApiError } from '../lib/api-error';
import { getCookie, setCookie, deleteCookie } from '../lib/cookies';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? getCookie('auth_token') : '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors for automatic token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Safe getCookie for SSR/Client
      const refreshToken = typeof window !== 'undefined' ? getCookie('refresh_token') : '';
      
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(normalizeApiError(error));
      }

      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
        // Use standard axios to avoid interceptor loop
        const response = await axios.put(`${baseUrl}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        // Fallback for different response structures
        const data = response.data.data || response.data;
        const { token, refreshToken: newRefreshToken } = data;

        if (!token) throw new Error('No token returned from refresh API');

        setCookie('auth_token', token);
        setCookie('refresh_token', newRefreshToken || refreshToken);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
        }

        processQueue(null, token);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        isRefreshing = false;

        const normalizedError = normalizeApiError(refreshError);
        console.error('[Axios Interceptor] Refresh token process failed:', refreshError);
        
        // Notify the user about the session failure
        if (typeof window !== 'undefined') {
          toast.error("Session Expired", {
            description: `Could not refresh session: ${normalizedError.message}. Please login again.`,
            duration: 5000,
          });
        }

        // Clear invalid tokens
        deleteCookie('auth_token');
        deleteCookie('refresh_token');

        // Force redirect to login if on client side with a slight delay to allow toast/logging
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 5000);
        }

        return Promise.reject(normalizedError);
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);
