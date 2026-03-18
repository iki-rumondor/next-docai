import { apiClient } from '@/shared/api/axios';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../model/auth.schema';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', {
      refreshToken: refreshToken,
    });
    return response.data;
  },
};
