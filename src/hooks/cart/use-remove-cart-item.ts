import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { useAuthStore } from "@/stores/auth.store";
import { Cart, CartItem } from "@/types";
import { useCartQueryKey } from "./use-cart";

export function useRemoveCartItem() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const queryKey = useCartQueryKey();

  return useMutation({
    mutationFn: (item: CartItem) => cartApi.removeItem(item.id, token!),

    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Cart>(queryKey);
      queryClient.setQueryData<Cart>(queryKey, (cart) =>
        cart && { ...cart, items: cart.items.filter((i) => i.id !== item.id) },
      );
      return { previous };
    },
    onSuccess: (_data, item) => toast.success(`${item.product.name} se quitó del carrito`),
    onError: (error, _item, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(getApiErrorMessage(error, "No se pudo quitar el producto"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}
