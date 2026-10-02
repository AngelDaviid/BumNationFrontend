import { useQuery } from "@tanstack/react-query";
import { favoritesApi } from "@/lib/api/favorites";
import { useAuthStore } from "@/stores/auth.store";

// La clave incluye al usuario para no mostrar los favoritos de otra sesión
export function useFavoritesQueryKey() {
  const userId = useAuthStore((state) => state.user?.id);
  return ["favorites", userId] as const;
}

export function useFavorites() {
  const { token, isAuthenticated, hasHydrated } = useAuthStore();
  const queryKey = useFavoritesQueryKey();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => favoritesApi.getAll(token!),
    enabled: isAuthenticated && !!token,
  });

  const favorites = data ?? [];
  const favoriteIds = new Set(favorites.map((favorite) => favorite.productId));

  return {
    favorites,
    products: favorites.map((favorite) => favorite.product),
    isFavorite: (productId: number) => favoriteIds.has(productId),
    // Mientras se lee la sesión también cuenta como cargando
    isLoading: !hasHydrated || (isAuthenticated && isLoading),
    isError,
    refetch,
  };
}
