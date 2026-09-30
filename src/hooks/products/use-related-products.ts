import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/types";

// Otros productos de la misma categoría, sin el actual
export function useRelatedProducts(product: Product | undefined, limit = 4) {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "related", product?.id, product?.categoryId, limit],
    queryFn: () => productsApi.getAll(1, limit + 1, undefined, String(product!.categoryId), { inStock: true }),
    enabled: !!product,
  });

  return {
    products: (data?.data ?? []).filter((p) => p.id !== product?.id).slice(0, limit),
    isLoading,
  };
}
