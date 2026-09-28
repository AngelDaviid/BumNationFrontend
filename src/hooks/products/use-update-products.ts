import {UpdateProductFormValues} from "@/common/schemas/product.schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "@/stores/auth.store";
import {Product} from "@/types";
import {productsApi} from "@/lib/api/products";

interface UpdateProductsVariables {
    id: number,
    data: UpdateProductFormValues
}

export function useUpdateProducts() {
    const queryClient = useQueryClient()
    const {token} = useAuthStore()

    return useMutation<Product, Error, UpdateProductsVariables>({
        mutationFn: ({id, data}) => productsApi.update(id, data, token!),

        onSuccess: (updatedProduct, {id}) => {
            queryClient.invalidateQueries({queryKey: ['products']})

            queryClient.setQueryData(['products', id], updatedProduct)
        },
    });
}