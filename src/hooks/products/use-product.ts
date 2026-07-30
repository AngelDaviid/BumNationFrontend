import {productsApi} from "@/lib/api/products";
import {useQuery} from "@tanstack/react-query";
import {Product} from "@/types";

interface ProductProps {
    id: number;
}

export const useProduct = ({id}: ProductProps) => {
    const {data, isLoading, isError, error} = useQuery<Product, Error>({
        queryKey: ['products', id],
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
    });

    return {
        product: data,
        isLoading,
        isError,
        error,
    };
}