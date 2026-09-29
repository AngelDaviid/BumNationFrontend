"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formattedPrice } from "@/common/formatted-price";
import { useCancelOrder, useUpdateOrderStatus } from "@/hooks/orders/use-admin-orders";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { Order, OrderStatus } from "@/types";
import { ORDER_STATUS_LABELS, OrderStatusBadge } from "./order-status-badge";

export function OrderDetail({ order, onChanged }: { order: Order; onChanged?: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [reason, setReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(order.status === "CANCELLED");
  const statusMutation = useUpdateOrderStatus();
  const cancelMutation = useCancelOrder();

  function handleStatus(next: OrderStatus) {
    const previous = status;
    setStatus(next);
    statusMutation.mutate({ id: order.id, status: next }, { onError: () => setStatus(previous), onSuccess: onChanged });
  }

  function handleCancel() {
    cancelMutation.mutate(
      { id: order.id, reason: reason || undefined },
      {
        onSuccess: () => {
          setCancelled(true);
          setShowCancel(false);
          onChanged?.();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center justify-between">
        <OrderStatusBadge status={cancelled ? "CANCELLED" : status} />
        <span className="text-lg font-semibold text-[#3fbf1f]">${formattedPrice(order.total)} COP</span>
      </div>

      {order.user && (
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="font-medium text-zinc-800">
            {order.user.firstName} {order.user.firstLastName}
          </p>
          <p className="text-zinc-500">{order.user.email}</p>
          {order.user.phone && <p className="text-zinc-500">{order.user.phone}</p>}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-xs">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2">Cant.</th>
              <th className="px-3 py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">{item.product?.name ?? `Producto ${item.productId}`}</td>
                <td className="px-3 py-2 text-center">{item.quantity}</td>
                <td className="px-3 py-2 text-right">
                  ${formattedPrice(String(Number(item.priceAtTime) * item.quantity))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cancelled ? (
        <p className="rounded-lg bg-red-50 p-3 text-red-600">
          Orden cancelada{order.cancelReason ? `: ${order.cancelReason}` : "."}
        </p>
      ) : (
        <>
          <label className="flex items-center gap-2 text-zinc-700">
            Estado
            <select
              value={status}
              disabled={statusMutation.isPending}
              onChange={(e) => handleStatus(e.target.value as OrderStatus)}
              className="rounded-md bg-zinc-100 px-2 py-1.5 outline-none focus:ring-2 focus:ring-[#6BFF3C]"
            >
              {Object.entries(ORDER_STATUS_LABELS)
                .filter(([value]) => value !== "CANCELLED")
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </select>
          </label>
          {statusMutation.error && <p className="text-red-500">{getApiErrorMessage(statusMutation.error)}</p>}

          {showCancel ? (
            <div className="flex flex-col gap-2 rounded-lg border border-red-200 p-3">
              <textarea
                value={reason}
                maxLength={500}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Motivo de la cancelación (opcional)"
                className="min-h-16 rounded-lg bg-zinc-100 px-3 py-2 outline-none focus:ring-2 focus:ring-red-300"
              />
              <p className="text-xs text-zinc-500">Al cancelar, el stock vuelve al inventario.</p>
              {cancelMutation.error && <p className="text-red-500">{getApiErrorMessage(cancelMutation.error)}</p>}
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending}>
                  {cancelMutation.isPending ? "Cancelando..." : "Confirmar cancelación"}
                </Button>
                <Button variant="outline" onClick={() => setShowCancel(false)}>
                  Volver
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="destructive" className="self-start" onClick={() => setShowCancel(true)}>
              Cancelar orden
            </Button>
          )}
        </>
      )}
    </div>
  );
}
