import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "@/stores/auth.store";
import {Product} from "@/types";
import {productsApi} from "@/lib/api/products";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/hooks/memberships/use-memberships";

interface UploadProductImageVariables {
    id: number,
    file: File
}

export function useUploadProductImage() {
    const queryClient = useQueryClient()
    const {token} = useAuthStore()

    return useMutation<Product, Error, UploadProductImageVariables>({
        mutationFn: ({id, file}) => productsApi.uploadProductImage(id, file, token!),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']})
            toast.success("Imagen actualizada")
        },
        onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo subir la imagen"),
    });
}
