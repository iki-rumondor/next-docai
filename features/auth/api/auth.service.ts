import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../model/auth.schema';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            name: 'Mock User',
            email: credentials.email,
            role: 'admin',
          },
        },
        meta: { 
          success: true,
          message: 'Mock login successful',
        },
      };
    }
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          token: 'mock-new-access-token',
          refreshToken: 'mock-new-refresh-token',
        },
        meta: { 
          success: true,
          message: 'Mock token refresh successful',
        },
      };
    }
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', {
      refreshToken: refreshToken,
    });
    return response.data;
  },
};
