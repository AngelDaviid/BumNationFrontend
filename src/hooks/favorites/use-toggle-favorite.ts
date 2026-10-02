import { useRequireAuth } from "@/hooks/shop/use-require-auth";
import { Product } from "@/types";
import { useFavorites } from "./use-favorites";
import { useAddFavorite } from "./use-add-favorite";
import { useRemoveFavorite } from "./use-remove-favorite";

export function useToggleFavorite() {
  const requireAuth = useRequireAuth();
  const { isFavorite } = useFavorites();
  const add = useAddFavorite();
  const remove = useRemoveFavorite();

  const toggleFavorite = (product: Product) => {
    if (!requireAuth("Inicia sesión para guardar tus favoritos")) return;
    if (isFavorite(product.id)) remove.mutate(product);
    else add.mutate(product);
  };

  return {
    isFavorite,
    toggleFavorite,
    isToggling: add.isPending || remove.isPending,
  };
}
