import { apiClient } from '@/shared/api/axios';
import { ApiResponse, PaginatedApiResponse } from '@/shared/types/api-response';
import { 
  Document, 
  ListDocumentsQuery 
} from '../model/documents.schema';

export const documentsService = {
  list: async (query?: ListDocumentsQuery): Promise<PaginatedApiResponse<Document>> => {
    const { data } = await apiClient.get<PaginatedApiResponse<Document>>('/documents', {
      params: query,
    });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Document>> => {
    const { data } = await apiClient.get<ApiResponse<Document>>(`/documents/${id}`);
    return data;
  },
};
