import {useMutation, useQueryClient} from "@tanstack/react-query";
import {productsApi} from "@/lib/api/products";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/hooks/memberships/use-memberships";

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation<void, Error, number>({
        mutationFn: (id) => productsApi.delete(id),

        onSuccess: (_, id) => {
            queryClient.removeQueries({queryKey: ['products', id]})
            queryClient.invalidateQueries({queryKey: ['products']})
            toast.success("Producto eliminado")
        },
        onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo eliminar el producto"),
    });
}
