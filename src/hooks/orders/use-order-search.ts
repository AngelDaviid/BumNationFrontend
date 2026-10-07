import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { useListParams } from "@/hooks/use-list-params";
import { Order } from "@/types";

const orderQueryKey = (orderNumber: number) => ["orders", "number", orderNumber];

const parseOrderNumber = (value?: string) => {
  const orderNumber = Number(value?.replace("#", ""));
  return Number.isInteger(orderNumber) && orderNumber > 0 ? orderNumber : null;
};

export function useOrderSearch() {
  const queryClient = useQueryClient();
  const { getParam, setDetail } = useListParams();
  const orderParam = getParam("order");
  const orderNumber = parseOrderNumber(orderParam);

  const { register, handleSubmit } = useForm<{ number: string }>({ defaultValues: { number: orderParam ?? "" } });

  const { data, isLoading, error } = useQuery({
    queryKey: orderQueryKey(orderNumber ?? 0),
    queryFn: () => ordersApi.searchByNumber(orderNumber ?? 0),
    enabled: orderNumber !== null,
    retry: false,
  });

  const onSearch = handleSubmit(({ number }) => {
    const target = parseOrderNumber(number);
    if (target) setDetail("order", String(target));
  });

  const selectOrder = (order: Order) => {
    queryClient.setQueryData(orderQueryKey(order.orderNumber), order);
    setDetail("order", String(order.orderNumber));
  };

  return {
    register,
    onSearch,
    isSearching: isLoading,
    searchError: getApiErrorMessage(error),
    selected: orderNumber !== null ? data ?? null : null,
    selectOrder,
    clearSelected: () => setDetail("order", undefined),
  };
}
