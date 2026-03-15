import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../model/user.schema';

export const usersService = {
  list: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserRequest): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/users', payload);
    return data;
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
