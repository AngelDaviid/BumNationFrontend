import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "@/stores/auth.store";
import {CreateProductData, Product} from "@/types";
import {productsApi} from "@/lib/api/products";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/hooks/memberships/use-memberships";

export function useCreateProduct() {
    const queryClient = useQueryClient()
    const {token} = useAuthStore()

    return useMutation<Product, Error, CreateProductData>({
        mutationFn: (data) => productsApi.create(data, token!),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']})
            toast.success("Producto creado")
        },
        onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo crear el producto"),
    });
}
