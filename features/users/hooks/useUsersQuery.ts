import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/features/users/api/users.service';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
