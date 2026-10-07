import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { ordersApi } from "@/lib/api/orders";


function useAdminOrders({ limit = 10 } = {}) {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => ordersApi.getAll(page, limit),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });

  const totalPages = Math.max(1, data?.meta.totalPage ?? 1);

  return {
    orders: data?.data ?? [],
    page,
    totalPages,
    isLoading: !hasHydrated || isLoading,
    error: error instanceof Error ? error.message : null,
    nextPage: () => setPage((p) => (p < totalPages ? p + 1 : p)),
    prevPage: () => setPage((p) => (p > 1 ? p - 1 : p)),
  };
}

export { useAdminOrders };



