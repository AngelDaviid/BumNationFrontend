import { useState } from "react";
import { useForm } from "react-hook-form";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/stores/auth.store";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { Order } from "@/types";

export function useOrderSearch() {
  const { token } = useAuthStore();
  const [selected, setSelected] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ number: string }>({ defaultValues: { number: "" } });

  const onSearch = handleSubmit(async ({ number }) => {
    const orderNumber = Number(number.replace("#", ""));
    if (!token || !Number.isInteger(orderNumber) || orderNumber <= 0) return;
    setSearchError(null);
    try {
      setSelected(await ordersApi.searchByNumber(orderNumber, token));
    } catch (err) {
      setSearchError(getApiErrorMessage(err));
    }
  });

  return {
    register,
    onSearch,
    isSearching: isSubmitting,
    searchError,
    selected,
    selectOrder: setSelected,
    clearSelected: () => setSelected(null),
  };
}
