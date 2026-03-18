import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  SourceFile, 
  ListFilesQuery,
  ListFilesData
} from '../model/files.schema';

export const filesService = {
  list: async (query?: ListFilesQuery): Promise<ApiResponse<ListFilesData>> => {
    const { data } = await apiClient.get<ApiResponse<ListFilesData>>('/source-files', {
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
