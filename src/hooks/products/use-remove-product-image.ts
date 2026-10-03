import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "@/stores/auth.store";
import {Product} from "@/types";
import {productsApi} from "@/lib/api/products";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/hooks/memberships/use-memberships";

export function useRemoveProductImage() {
    const queryClient = useQueryClient()
    const {token} = useAuthStore()

    return useMutation<Product, Error, number>({
        mutationFn: (id) => productsApi.removeProductImage(id, token!),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']})
            toast.success("Imagen eliminada")
        },
        onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo eliminar la imagen"),
    });
}
