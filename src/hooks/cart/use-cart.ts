import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useAuthStore } from "@/stores/auth.store";

// La clave incluye al usuario para no mostrar el carrito de otra sesión
export function useCartQueryKey() {
  const userId = useAuthStore((state) => state.user?.id);
  return ["cart", userId] as const;
}

export function useCart() {
  const { token, isAuthenticated, hasHydrated } = useAuthStore();
  const queryKey = useCartQueryKey();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => cartApi.getCart(token!),
    enabled: isAuthenticated && !!token,
  });

  const items = data?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const hasStockIssues = items.some((item) => item.quantity > item.product.stock);

  const quantityInCart = (productId: number) =>
    items.find((item) => item.productId === productId)?.quantity ?? 0;

  return {
    cart: data,
    items,
    itemCount,
    subtotal,
    hasStockIssues,
    quantityInCart,
    // Mientras se lee la sesión también cuenta como cargando
    isLoading: !hasHydrated || (isAuthenticated && isLoading),
    isError,
    refetch,
  };
}
