import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";

export function useUploadUserImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      usersApi.uploadUserImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Imagen actualizada");
    },
    onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo subir la imagen"),
  });
} 