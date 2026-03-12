import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { User } from '@/features/users/model/user.schema';

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiClient.get('/users');
};
