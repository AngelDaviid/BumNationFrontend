import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export function useCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => ordersApi.checkout(),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success(`Pedido #${order.orderNumber} creado, queda pendiente de confirmación`);
      router.push(`/orders/${order.id}`);
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.error(getApiErrorMessage(error, "No se pudo crear el pedido"));
    },
  });
}
