import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/stores/auth.store";

// Los estados en los que el cliente todavía puede cancelar (así lo valida el backend)
const CANCELLABLE_STATUSES = ["PENDING_CONFIRMATION", "CONFIRMED"];

export function useMyOrder(orderId: string) {
  const { token, isAuthenticated, hasHydrated, user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-orders", user?.id, "detail", orderId],
    queryFn: () => ordersApi.getById(orderId, token!),
    enabled: isAuthenticated && !!token && !!orderId,
  });

  return {
    order: data,
    canCancel: !!data && CANCELLABLE_STATUSES.includes(data.status),
    isLoading: !hasHydrated || (isAuthenticated && isLoading),
    isError,
  };
}
