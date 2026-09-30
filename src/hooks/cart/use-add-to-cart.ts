import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { useAuthStore } from "@/stores/auth.store";
import { useRequireAuth } from "@/hooks/shop/use-require-auth";
import { useCartDrawerStore } from "@/stores/cart-drawer.store";
import { Product } from "@/types";
import { useCart } from "./use-cart";

interface AddToCartVariables {
  product: Product;
  quantity: number;
}

export function useAddToCart() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const requireAuth = useRequireAuth();
  const { quantityInCart } = useCart();
  const openDrawer = useCartDrawerStore((state) => state.open);

  const mutation = useMutation({
    mutationFn: ({ product, quantity }: AddToCartVariables) => cartApi.addItem(product.id, quantity, token!),
    onSuccess: (_item, { product }) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`${product.name} se agregó al carrito`);
      openDrawer();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "No se pudo agregar al carrito")),
  });

  const addToCart = (product: Product, quantity = 1) => {
    if (!requireAuth("Inicia sesión para agregar productos al carrito")) return;

    // El backend suma a lo que ya hay en el carrito sin revisar el total
    const available = product.stock - quantityInCart(product.id);
    if (available < quantity) {
      toast.error(
        available <= 0
          ? `Ya tienes todas las unidades disponibles de ${product.name}`
          : `Solo puedes agregar ${available} unidades más de ${product.name}`,
      );
      return;
    }

    mutation.mutate({ product, quantity });
  };

  return {
    addToCart,
    isAdding: mutation.isPending,
    addingProductId: mutation.isPending ? mutation.variables?.product.id : undefined,
  };
}
