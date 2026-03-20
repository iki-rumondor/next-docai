import { env } from '@/shared/config/env';
import { apiClient } from '../../../shared/api/axios';
import { ApiResponse } from '../../../shared/types/api-response';
import { ExampleData } from '../model/example.schema';

export const fetchExampleData = async (): Promise<ApiResponse<ExampleData>> => {
  if (env.NEXT_PUBLIC_MOCK_API) {
    // Return mock data
    return {
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Mock Example Data',
        createdAt: new Date().toISOString(),
      },
      meta: {
        success: true,
        message: 'Loaded mock data',
      },
    };
  }

  const { data } = await apiClient.get<ApiResponse<ExampleData>>('/example-endpoint');
  return data;
};
