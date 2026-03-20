import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { SourceFile } from '@/features/files/model/files.schema';

export const uploadService = {
  upload: async (file: File, pages?: string): Promise<ApiResponse<SourceFile>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return {
        data: {
          id: 'sf-' + Math.random().toString(36).substr(2, 9),
          file_name: file.name,
          file_path: '/tmp/' + file.name,
          mime_type: file.type,
          page_count: pages ? pages.split(',').length : 1,
          status: 'uploaded',
          progress: 0,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        meta: { 
          success: true,
          message: 'File uploaded successfully (mock)',
        },
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    if (pages) {
      formData.append('pages', pages);
    }

    const { data } = await apiClient.post<ApiResponse<SourceFile>>('/source-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
