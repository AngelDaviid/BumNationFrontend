import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { useAuthStore } from "@/stores/auth.store";

interface CancelOrderFormValues {
  reason: string;
}

export function useCancelMyOrder(orderId: string) {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<CancelOrderFormValues>({ defaultValues: { reason: "" } });

  const mutation = useMutation({
    mutationFn: (reason?: string) => ordersApi.cancel(orderId, reason, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cancelaste el pedido");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "No se pudo cancelar el pedido")),
  });

  const cancelOrder = (onDone: () => void) =>
    handleSubmit(({ reason }) =>
      mutation.mutate(reason.trim() || undefined, {
        onSuccess: () => {
          reset();
          onDone();
        },
      }),
    );

  return {
    register,
    cancelOrder,
    isCancelling: mutation.isPending,
  };
}
