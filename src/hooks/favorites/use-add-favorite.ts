import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { favoritesApi } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { useAuthStore } from "@/stores/auth.store";
import { Favorite, Product } from "@/types";
import { useFavoritesQueryKey } from "./use-favorites";

export function useAddFavorite() {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const queryKey = useFavoritesQueryKey();

  return useMutation({
    mutationFn: (product: Product) => favoritesApi.add(product.id, token!),

    // Marca el corazón al instante; si falla se restaura
    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Favorite[]>(queryKey);
      const optimistic: Favorite = {
        id: `temp-${product.id}`,
        userId: user?.id ?? "",
        productId: product.id,
        createdAt: new Date().toISOString(),
        product,
      };
      queryClient.setQueryData<Favorite[]>(queryKey, (favorites = []) => [optimistic, ...favorites]);
      return { previous };
    },
    onSuccess: (_favorite, product) => toast.success(`${product.name} se agregó a favoritos`),
    onError: (error, _product, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      toast.error(getApiErrorMessage(error, "No se pudo agregar a favoritos"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
