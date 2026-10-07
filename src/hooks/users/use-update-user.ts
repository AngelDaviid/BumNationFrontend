import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types';
import {UpdateUserFormValues} from "@/common/schemas/user.schema";
import { toast } from "sonner";

interface UpdateUserVariables {
  id: string;
  data: UpdateUserFormValues;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserVariables>({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),

    onSuccess: (updatedUser, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      queryClient.setQueryData(['users', id], updatedUser);
      toast.success('Usuario actualizado');
    },
    onError: (error) => toast.error(error.message || 'No se pudo actualizar el usuario'),
  });
}