import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  SourceFile, 
  ListFilesQuery,
  SourceFileStatus
} from '../model/files.schema';

export const filesService = {
  list: async (query?: ListFilesQuery): Promise<ApiResponse<SourceFile[]>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: ([
          {
            id: '1',
            file_name: 'Mock Document 1.pdf',
            file_path: '/tmp/mock1.pdf',
            mime_type: 'application/pdf',
            page_count: 5,
            status: 'completed' as SourceFileStatus,
            progress: 100,
            error_message: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            processing_duration: 12.5,
          },
          {
            id: '2',
            file_name: 'Mock Image.png',
            file_path: '/tmp/mock2.png',
            mime_type: 'image/png',
            page_count: 1,
            status: 'processing' as SourceFileStatus,
            progress: 45,
            error_message: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ] as SourceFile[]).filter(file => {
          if (!query?.search) return true;
          return file.file_name.toLowerCase().includes(query.search.toLowerCase()) || 
                 file.id.includes(query.search);
        }),
        pagination: {
          total_items: 2,
          page: query?.page || 1,
          limit: query?.limit || 10,
          total_pages: 1,
          has_next_page: false,
          has_prev_page: false
        },
        meta: { success: true, message: 'Mock data loaded' },
      };
    }

    const { data } = await apiClient.get<ApiResponse<SourceFile[]>>('/source-files', {
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
          processing_duration: 45.2,
          uploaded_by: {
            id: 'u1',
            name: 'Mock User',
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
          status: 'failed',
          progress: 0,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          processing_duration: 14.8,
        },
        meta: { success: true, message: 'Retrying processing' },
      };
    }

    const { data } = await apiClient.post<ApiResponse<SourceFile>>(`/source-files/${id}/retry`);
    return data;
  },

  getFileBlob: async (filePath: string): Promise<Blob> => {
    // Ensure the path doesn't have double slashes if it starts with uploads/
    const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    // We use standard axios or a specific config to get the blob
    // apiClient already has the base URL and auth interceptors
    const response = await apiClient.get(cleanPath, {
      responseType: 'blob',
    });
    
    return response.data;
  },
};
