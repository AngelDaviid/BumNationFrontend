import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { ordersApi } from "@/lib/api/orders";
import { OrderStatus } from "@/types";

export function useAdminOrders({ limit = 10 } = {}) {
  const { token, hasHydrated } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => ordersApi.getAll(token!, page, limit),
    enabled: !!token,
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

export function useUpdateOrderStatus() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// Cancelar devuelve el stock de los productos al inventario
export function useCancelOrder() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ordersApi.cancelAsAdmin(id, reason, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
