import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Vaciaste el carrito");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "No se pudo vaciar el carrito")),
  });
}
