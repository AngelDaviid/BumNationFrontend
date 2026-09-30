import { OrderStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: "Por confirmar",
  CONFIRMED: "Confirmada",
  AWAITING_PAYMENT: "Esperando pago",
  PAID: "Pagada",
  SHIPPED: "Enviada",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
};

const styles: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-sky-100 text-sky-700",
  AWAITING_PAYMENT: "bg-amber-100 text-amber-700",
  PAID: "bg-violet-100 text-violet-700",
  SHIPPED: "bg-sky-100 text-sky-700",
  DELIVERED: "bg-[#6BFF3C]/15 text-[#3f9c1f]",
  CANCELLED: "bg-red-100 text-red-600",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
