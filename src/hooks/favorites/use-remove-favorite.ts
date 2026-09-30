import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { favoritesApi } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { useAuthStore } from "@/stores/auth.store";
import { Favorite, Product } from "@/types";
import { useFavoritesQueryKey } from "./use-favorites";

export function useRemoveFavorite() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const queryKey = useFavoritesQueryKey();

  return useMutation({
    mutationFn: (product: Product) => favoritesApi.remove(product.id, token!),

    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Favorite[]>(queryKey);
      queryClient.setQueryData<Favorite[]>(queryKey, (favorites = []) =>
        favorites.filter((favorite) => favorite.productId !== product.id),
      );
      return { previous };
    },
    onSuccess: (_favorite, product) => toast.success(`${product.name} se quitó de favoritos`),
    onError: (error, _product, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      toast.error(getApiErrorMessage(error, "No se pudo quitar de favoritos"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
