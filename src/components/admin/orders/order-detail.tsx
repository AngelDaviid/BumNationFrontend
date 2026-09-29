"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusSelect } from "@/components/admin/selecteables/status-select";
import { formattedPrice } from "@/common/formatted-price";
import { Order, OrderStatus } from "@/types";
import { ORDER_STATUS_LABELS, OrderStatusBadge } from "./order-status-badge";
import { useOrderDetail } from '../../../hooks/orders/use-order-detail'

const STATUS_OPTIONS = (Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][])
  .filter(([value]) => value !== "CANCELLED")
  .map(([value, label]) => ({ value, label }));

export function OrderDetail({ order, onChanged }: { order: Order; onChanged?: () => void }) {
  const {
    status,
    cancelled,
    changeStatus,
    isChangingStatus,
    showCancel,
    openCancel,
    closeCancel,
    register,
    onCancel,
    isCancelling,
  } = useOrderDetail(order, onChanged);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center justify-between">
        <OrderStatusBadge status={status} />
        <span className="text-lg font-semibold ">${formattedPrice(order.total)} COP</span>
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
          <Field label="Estado">
            <StatusSelect
              value={status}
              options={STATUS_OPTIONS}
              disabled={isChangingStatus}
              onChange={changeStatus}
            />
          </Field>

          {showCancel ? (
            <form
              onSubmit={onCancel}
              className="flex flex-col gap-2 rounded-lg border border-red-200 p-3"
            >
              <Field label="Motivo de la cancelación (opcional)">
                <Input placeholder="Ej. El cliente no respondió" registration={register("reason", { maxLength: 500 })} />
              </Field>
              <p className="text-xs text-zinc-500">Al cancelar, el stock vuelve al inventario.</p>
              <div className="flex gap-2">
                <Button type="submit" variant="destructive" disabled={isCancelling}>
                  {isCancelling ? "Cancelando..." : "Confirmar cancelación"}
                </Button>
                <Button type="button" variant="outline" onClick={closeCancel}>
                  Volver
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="destructive" className="self-start" onClick={openCancel}>
              Cancelar orden
            </Button>
          )}
        </>
      )}
    </div>
  );
}
