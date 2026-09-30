import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { useAuthStore } from "@/stores/auth.store";

// Convierte el carrito en una orden; el backend descuenta el stock y vacía el carrito
export function useCheckout() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => ordersApi.checkout(token!),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success(`Pedido #${order.orderNumber} creado, queda pendiente de confirmación`);
      router.push(`/orders/${order.id}`);
    },
    onError: (error) => {
      // Si el backend quitó productos inactivos, el carrito cambió
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.error(getApiErrorMessage(error, "No se pudo crear el pedido"));
    },
  });
}
