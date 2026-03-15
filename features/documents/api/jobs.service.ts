import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { Job } from '../model/jobs.schema';

export const jobsService = {
  getById: async (id: string): Promise<ApiResponse<Job>> => {
    const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return data;
  },

  retry: async (id: string): Promise<ApiResponse<Job>> => {
    const { data } = await apiClient.post<ApiResponse<Job>>(`/jobs/${id}/retry`);
    return data;
  },
};
