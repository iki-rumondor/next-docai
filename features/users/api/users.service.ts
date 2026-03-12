import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { User } from '../model/user.schema';

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiClient.get('/users');
};
