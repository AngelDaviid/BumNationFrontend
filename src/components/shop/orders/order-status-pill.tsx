import { cn } from "@/lib/utils/utils";
import { OrderStatus } from "@/types";

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  PENDING_CONFIRMATION: { label: "Pendiente de confirmación", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  CONFIRMED: { label: "Confirmado", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  AWAITING_PAYMENT: { label: "Esperando pago", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  PAID: { label: "Pagado", className: "bg-green-50 text-green-700 ring-green-200" },
  SHIPPED: { label: "Enviado", className: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  DELIVERED: { label: "Entregado", className: "bg-green-50 text-green-700 ring-green-200" },
  CANCELLED: { label: "Cancelado", className: "bg-red-50 text-red-700 ring-red-200" },
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", className)}>
      {label}
    </span>
  );
}
