import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { ordersApi } from "@/lib/api/orders";


function useAdminOrders({ page = 1, limit = 10 } = {}) {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => ordersApi.getAll(page, limit),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });

  return {
    orders: data?.data ?? [],
    totalPages: Math.max(1, data?.meta.totalPage ?? 1),
    isLoading: !hasHydrated || isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

export { useAdminOrders };
