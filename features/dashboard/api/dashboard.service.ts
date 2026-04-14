import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { DashboardStatsData } from '../model/dashboard.schema';

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStatsData>> => {
    const response = await apiClient.get<ApiResponse<DashboardStatsData>>('/dashboard/stats');
    return response.data;
  },
};
