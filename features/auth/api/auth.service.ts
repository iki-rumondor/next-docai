import { apiClient } from '@/shared/api/axios';
import { LoginRequest, LoginResponse } from '../model/auth.schema';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};
