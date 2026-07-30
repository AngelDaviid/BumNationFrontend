import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/stores/auth.store';
import { User } from '@/types';
import {UpdateUserFormValues} from "@/common/schemas/user.schema";

interface UpdateUserVariables {
  id: string;
  data: UpdateUserFormValues;
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