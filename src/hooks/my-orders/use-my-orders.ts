import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/stores/auth.store";

export function useMyOrders({ page = 1, limit = 10 } = {}) {
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["my-orders", user?.id, page, limit],
    queryFn: () => ordersApi.getMyOrders(page, limit),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
    refetchOnWindowFocus: "always",
  });

  return {
    orders: data?.data ?? [],
    totalPages: data?.meta.totalPage ?? 1,
    isLoading: !hasHydrated || (isAuthenticated && isLoading),
    isFetching,
    isError,
    refetch,
  };
}
