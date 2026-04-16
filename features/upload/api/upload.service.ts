import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { SourceFile } from '@/features/files/model/files.schema';

export const uploadService = {
  upload: async (file: File, docType?: string, pages?: string, onProgress?: (progress: number) => void): Promise<ApiResponse<SourceFile>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      // Simulate progress for mock
      if (onProgress) {
        onProgress(30);
        await new Promise(resolve => setTimeout(resolve, 500));
        onProgress(60);
        await new Promise(resolve => setTimeout(resolve, 500));
        onProgress(90);
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
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
    if (docType) {
      formData.append('doc_type', docType);
    }

    const { data } = await apiClient.post<ApiResponse<SourceFile>>('/source-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return data;
  },
};
