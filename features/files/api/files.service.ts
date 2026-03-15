import { apiClient } from '@/shared/api/axios';
import { ApiResponse, PaginatedApiResponse } from '@/shared/types/api-response';
import { 
  SourceFile, 
  ListFilesQuery 
} from '../model/files.schema';

export const filesService = {
  list: async (query?: ListFilesQuery): Promise<PaginatedApiResponse<SourceFile>> => {
    const { data } = await apiClient.get<PaginatedApiResponse<SourceFile>>('/source-files', {
      params: query,
    });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<SourceFile>> => {
    const { data } = await apiClient.get<ApiResponse<SourceFile>>(`/source-files/${id}`);
    return data;
  },

  retry: async (id: string): Promise<ApiResponse<SourceFile>> => {
    const { data } = await apiClient.post<ApiResponse<SourceFile>>(`/source-files/${id}/retry`);
    return data;
  },
};
