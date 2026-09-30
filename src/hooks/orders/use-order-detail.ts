import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateOrderStatus } from "@/hooks/orders/use-update-order";
import { useCancelOrder } from "@/hooks/orders/use-cancell-order";
import { Order, OrderStatus } from "@/types";

export function useOrderDetail(order: Order, onChanged?: () => void) {
  const [status, setStatus] = useState(order.status);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(order.status === "CANCELLED");
  const statusMutation = useUpdateOrderStatus();
  const cancelMutation = useCancelOrder();
  const { register, handleSubmit } = useForm<{ reason: string }>({ defaultValues: { reason: "" } });

  function changeStatus(next: OrderStatus) {
    const previous = status;
    setStatus(next);
    statusMutation.mutate({ id: order.id, status: next }, { onError: () => setStatus(previous), onSuccess: onChanged });
  }

  const onCancel = handleSubmit(({ reason }) => {
    cancelMutation.mutate(
      { id: order.id, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          setCancelled(true);
          setShowCancel(false);
          onChanged?.();
        },
      },
    );
  });

  return {
    status: cancelled ? ("CANCELLED" as const) : status,
    cancelled,
    changeStatus,
    isChangingStatus: statusMutation.isPending,
    showCancel,
    openCancel: () => setShowCancel(true),
    closeCancel: () => setShowCancel(false),
    register,
    onCancel,
    isCancelling: cancelMutation.isPending,
  };
}
