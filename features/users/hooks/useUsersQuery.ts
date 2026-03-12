import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users.service';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
