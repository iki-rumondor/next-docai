import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  });
};
