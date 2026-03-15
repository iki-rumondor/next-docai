import axios from 'axios';
import { normalizeApiError } from '../lib/api-error';
import { getCookie } from '../lib/cookies';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

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
    return response.data;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  }
);
