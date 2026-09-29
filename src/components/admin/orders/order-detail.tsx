"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusSelect } from "@/components/admin/status-select";
import { formattedPrice } from "@/common/formatted-price";
import { useCancelOrder, useUpdateOrderStatus } from "@/hooks/orders/use-admin-orders";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { Order, OrderStatus } from "@/types";
import { ORDER_STATUS_LABELS, OrderStatusBadge } from "./order-status-badge";

const STATUS_OPTIONS = (Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][])
  .filter(([value]) => value !== "CANCELLED")
  .map(([value, label]) => ({ value, label }));

export function OrderDetail({ order, onChanged }: { order: Order; onChanged?: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(order.status === "CANCELLED");
  const statusMutation = useUpdateOrderStatus();
  const cancelMutation = useCancelOrder();
  const { register, handleSubmit } = useForm<{ reason: string }>({ defaultValues: { reason: "" } });

  function handleStatus(next: OrderStatus) {
    const previous = status;
    setStatus(next);
    statusMutation.mutate({ id: order.id, status: next }, { onError: () => setStatus(previous), onSuccess: onChanged });
  }

  const onCancel = ({ reason }: { reason: string }) => {
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
  };

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

      <div className="rounded-lg border border-zinc-200">
        <Table className="text-xs">
          <TableHeader className="bg-zinc-50 text-[11px] uppercase tracking-wide">
            <TableRow>
              <TableHead className="text-zinc-500">Producto</TableHead>
              <TableHead className="text-center text-zinc-500">Cant.</TableHead>
              <TableHead className="text-right text-zinc-500">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product?.name ?? `Producto ${item.productId}`}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  ${formattedPrice(String(Number(item.priceAtTime) * item.quantity))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {cancelled ? (
        <p className="rounded-lg bg-red-50 p-3 text-red-600">
          Orden cancelada{order.cancelReason ? `: ${order.cancelReason}` : "."}
        </p>
      ) : (
        <>
          <Field
            label="Estado"
            error={getApiErrorMessage(statusMutation.error) ?? undefined}
          >
            <StatusSelect
              value={status}
              options={STATUS_OPTIONS}
              disabled={statusMutation.isPending}
              onChange={handleStatus}
            />
          </Field>

          {showCancel ? (
            <form
              onSubmit={handleSubmit(onCancel)}
              className="flex flex-col gap-2 rounded-lg border border-red-200 p-3"
            >
              <Field
                label="Motivo de la cancelación (opcional)"
                error={getApiErrorMessage(cancelMutation.error) ?? undefined}
              >
                <Input placeholder="Ej. El cliente no respondió" registration={register("reason", { maxLength: 500 })} />
              </Field>
              <p className="text-xs text-zinc-500">Al cancelar, el stock vuelve al inventario.</p>
              <div className="flex gap-2">
                <Button type="submit" variant="destructive" disabled={cancelMutation.isPending}>
                  {cancelMutation.isPending ? "Cancelando..." : "Confirmar cancelación"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCancel(false)}>
                  Volver
                </Button>
              </div>
            </form>
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
