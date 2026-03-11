import { useQuery } from '@tanstack/react-query';
import { fetchExampleData } from '../api/example.service';

export const useExampleQuery = () => {
  return useQuery({
    queryKey: ['example'],
    queryFn: fetchExampleData,
  });
};
