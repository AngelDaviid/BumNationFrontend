import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { Cart } from "@/types";
import { useCartQueryKey } from "./use-cart";

interface UpdateCartItemVariables {
  itemId: string;
  quantity: number;
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const queryKey = useCartQueryKey();

  return useMutation({
    mutationFn: ({ itemId, quantity }: UpdateCartItemVariables) => cartApi.updateItem(itemId, quantity),

    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Cart>(queryKey);
      queryClient.setQueryData<Cart>(queryKey, (cart) =>
        cart && {
          ...cart,
          items: cart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        },
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(getApiErrorMessage(error, "No se pudo actualizar la cantidad"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}
