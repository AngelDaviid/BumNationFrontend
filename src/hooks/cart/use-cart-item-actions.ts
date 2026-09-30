import { CartItem } from "@/types";
import { useUpdateCartItem } from "./use-update-cart-item";
import { useRemoveCartItem } from "./use-remove-cart-item";

// Acciones de una fila del carrito, compartidas por la página y el carrito lateral
export function useCartItemActions() {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  return {
    changeQuantity: (item: CartItem, quantity: number) => updateItem.mutate({ itemId: item.id, quantity }),
    remove: (item: CartItem) => removeItem.mutate(item),
    isUpdating: (item: CartItem) => updateItem.isPending && updateItem.variables?.itemId === item.id,
  };
}
