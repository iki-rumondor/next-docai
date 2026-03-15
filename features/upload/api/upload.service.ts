import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { SourceFile } from '@/features/files/model/files.schema';

export const uploadService = {
  upload: async (file: File, pages?: string): Promise<ApiResponse<SourceFile>> => {
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
