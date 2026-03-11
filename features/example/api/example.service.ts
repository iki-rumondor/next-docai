import { apiClient } from '../../../shared/api/axios';
import { ApiResponse } from '../../../shared/types/api-response';
import { ExampleData } from '../model/example.schema';

export const fetchExampleData = async (): Promise<ApiResponse<ExampleData>> => {
  // Replace with actual endpoint to use apiClient.get('/example-endpoint')
  // This is a minimal placeholder
  return apiClient.get('/example-endpoint');
};
