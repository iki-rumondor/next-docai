import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  Document, 
  ListDocumentsQuery,
  ListDocumentsData 
} from '../model/documents.schema';

export const documentsService = {
  list: async (query?: ListDocumentsQuery): Promise<ApiResponse<ListDocumentsData>> => {
    const { data } = await apiClient.get<ApiResponse<ListDocumentsData>>('/documents', {
      params: query,
    });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Document>> => {
    const { data } = await apiClient.get<ApiResponse<Document>>(`/documents/${id}`);
    return data;
  },
};
