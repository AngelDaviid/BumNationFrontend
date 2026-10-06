import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/stores/auth.store";

const CANCELLABLE_STATUSES = ["PENDING_CONFIRMATION", "CONFIRMED"];

export function useMyOrder(orderId: string) {
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-orders", user?.id, "detail", orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: isAuthenticated && !!orderId,
    refetchInterval: 30_000,
    refetchOnWindowFocus: "always",
  });

  return {
    order: data,
    canCancel: !!data && CANCELLABLE_STATUSES.includes(data.status),
    isLoading: !hasHydrated || (isAuthenticated && isLoading),
    isError,
  };
}
