import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users'; // donde tengas tu updateUser
import { useAuthStore } from '@/stores/auth.store';
import { UpdateUserDataAdmin, User } from '@/types';

interface UpdateUserVariables {
  id: string;
  data: UpdateUserDataAdmin;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<User, Error, UpdateUserVariables>({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data, token!),

    onSuccess: (updatedUser, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      queryClient.setQueryData(['users', id], updatedUser);
    },
  });
}