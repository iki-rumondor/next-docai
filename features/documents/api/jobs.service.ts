import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { Job } from '../model/jobs.schema';

export const jobsService = {
  getById: async (id: string): Promise<ApiResponse<Job>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          document_id: 'doc-1',
          status: 'completed',
          progress: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        meta: { 
          success: true,
          message: 'Mock job loaded',
        },
      };
    }
    const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return data;
  },

  retry: async (id: string): Promise<ApiResponse<Job>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          document_id: 'doc-1',
          status: 'queued',
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        meta: { 
          success: true,
          message: 'Job retry initiated',
        },
      };
    }
    const { data } = await apiClient.post<ApiResponse<Job>>(`/jobs/${id}/retry`);
    return data;
  },
};
