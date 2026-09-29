import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";

export function useUploadUserImage() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      usersApi.uploadUserImage(id, file, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Imagen actualizada");
    },
    onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo subir la imagen"),
  });
} 