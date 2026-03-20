import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  SourceFile, 
  ListFilesQuery,
  ListFilesData
} from '../model/files.schema';

export const filesService = {
  list: async (query?: ListFilesQuery): Promise<ApiResponse<ListFilesData>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          data: [
            {
              id: '1',
              file_name: 'Mock Document 1.pdf',
              file_path: '/tmp/mock1.pdf',
              mime_type: 'application/pdf',
              page_count: 5,
              status: 'completed',
              progress: 100,
              error_message: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '2',
              file_name: 'Mock Image.png',
              file_path: '/tmp/mock2.png',
              mime_type: 'image/png',
              page_count: 1,
              status: 'processing',
              progress: 45,
              error_message: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ],
          pagination: {
            total: 2,
            page: query?.page || 1,
            limit: query?.limit || 10,
            total_pages: 1,
          },
        },
        meta: { success: true, message: 'Mock data loaded' },
      };
    }

    const { data } = await apiClient.get<ApiResponse<ListFilesData>>('/source-files', {
      params: query,
    });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<SourceFile>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          file_name: 'Mock Document.pdf',
          file_path: '/tmp/mock.pdf',
          mime_type: 'application/pdf',
          page_count: 5,
          status: 'completed',
          progress: 100,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          uploaded_by: {
            id: 'u1',
            name: 'Mock User',
            email: 'mock@example.com',
            role: 'admin'
          }
        },
        meta: { success: true },
      };
    }

    const { data } = await apiClient.get<ApiResponse<SourceFile>>(`/source-files/${id}`);
    return data;
  },

  retry: async (id: string): Promise<ApiResponse<SourceFile>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          file_name: 'Mock Document.pdf',
          file_path: '/tmp/mock.pdf',
          mime_type: 'application/pdf',
          page_count: 5,
          status: 'queued',
          progress: 0,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        meta: { success: true, message: 'Retrying processing' },
      };
    }

    const { data } = await apiClient.post<ApiResponse<SourceFile>>(`/source-files/${id}/retry`);
    return data;
  },
};
