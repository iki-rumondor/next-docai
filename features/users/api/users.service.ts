import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../model/user.schema';

export const usersService = {
  list: async (): Promise<ApiResponse<User[]>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: [
          {
            id: 'mock-1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
          },
          {
            id: 'mock-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'operator',
          },
        ],
        meta: { 
          success: true,
          message: 'Mock users list loaded',
        },
      };
    }
    const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          name: 'Mock User',
          email: 'mock@example.com',
          role: 'admin',
        },
        meta: { success: true },
      };
    }
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserRequest): Promise<ApiResponse<User>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          ...payload,
        },
        meta: { 
          success: true,
          message: 'User created successfully (mock)',
        },
      };
    }
    const { data } = await apiClient.post<ApiResponse<User>>('/users', payload);
    return data;
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<ApiResponse<User>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          name: payload.name || 'Updated Mock User',
          email: payload.email || 'updated@example.com',
          role: payload.role || 'admin',
        },
        meta: { 
          success: true,
          message: 'User updated successfully (mock)',
        },
      };
    }
    const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      console.log('Mock delete user:', id);
      return;
    }
    await apiClient.delete(`/users/${id}`);
  },
};
