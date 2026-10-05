import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/stores/auth.store";

export function useMyOrders(limit = 10) {
  const { token, isAuthenticated, hasHydrated, user } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["my-orders", user?.id, page, limit],
    queryFn: () => ordersApi.getMyOrders(token!, page, limit),
    enabled: isAuthenticated && !!token,
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
    refetchOnWindowFocus: "always",
  });

  const totalPages = data?.meta.totalPage ?? 1;

  return {
    orders: data?.data ?? [],
    page,
    totalPages,
    isLoading: !hasHydrated || (isAuthenticated && isLoading),
    isFetching,
    isError,
    refetch,
    nextPage: () => setPage((p) => (p < totalPages ? p + 1 : p)),
    prevPage: () => setPage((p) => (p > 1 ? p - 1 : p)),
  };
}
