import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import { useCategories } from "@/hooks/categories/use-categories";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { Category } from "@/types";

export function useCategoryProducts(category: Category) {
  const queryClient = useQueryClient();
  const { categories } = useCategories();

  const { data, isLoading } = useQuery({
    queryKey: ["products", "by-category", category.id],
    queryFn: () => productsApi.getAll(1, 100, undefined, String(category.id)),
  });

  const moveProduct = useMutation({
    mutationFn: ({ productId, categoryId }: { productId: number; categoryId: number }) =>
      productsApi.changeCategory(productId, categoryId),
    onSuccess: (product, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      const target = categories.find((c) => c.id === categoryId)?.name ?? "otra categoría";
      toast.success(`"${product.name}" ahora está en ${target}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo cambiar la categoría del producto"),
  });

  const products = data?.data ?? [];

  return {
    products,
    total: data?.meta.total ?? 0,
    isLoading,
    canDelete: !isLoading && products.length === 0,
    otherCategories: categories
      .filter((c) => c.id !== category.id)
      .map((c) => ({ value: String(c.id), label: c.name })),
    moveProduct: (productId: number, categoryId: string) =>
      moveProduct.mutate({ productId, categoryId: Number(categoryId) }),
    isMoving: moveProduct.isPending,
  };
}
