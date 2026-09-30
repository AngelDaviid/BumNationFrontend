"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ImageOff, PackageX } from "lucide-react";
import { formattedDate } from "@/common/formatted-date";
import { formattedPrice } from "@/common/formatted-price";
import { useMyOrder } from "@/hooks/my-orders";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { CancelOrderButton } from "./cancel-order-button";
import { OrderStatusPill } from "./order-status-pill";

export function MyOrderDetail({ orderId }: { orderId: string }) {
  const { order, canCancel, isLoading, isError } = useMyOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader tone="light" label="Cargando pedido…" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <EmptyState
        icon={PackageX}
        title="No encontramos este pedido"
        action={
          <Button asChild className="h-10 bg-[#65C33A] px-5 font-semibold text-white hover:bg-[#58ad32]">
            <Link href="/orders">Ver mis pedidos</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-[#65C33A]"
      >
        <ChevronLeft size={16} /> Mis pedidos
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#65C33A]">{formattedDate(order.createdAt)}</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-4xl">Pedido #{order.orderNumber}</h1>
        </div>
        <OrderStatusPill status={order.status} />
      </header>

      {order.status === "CANCELLED" && order.cancelReason && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Motivo: {order.cancelReason}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white px-4 sm:px-5">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                {item.product.imageUrl ? (
                  <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="64px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <ImageOff className="size-6" strokeWidth={1.5} aria-label="Sin imagen" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{item.product.name}</p>
                <p className="text-xs text-zinc-500">
                  {item.quantity} × ${formattedPrice(item.priceAtTime)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-zinc-900">
                ${formattedPrice(String(parseFloat(item.priceAtTime) * item.quantity))}
              </span>
            </li>
          ))}
        </ul>

        <aside className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-zinc-700">Total</span>
            <span className="text-2xl font-bold text-[#65C33A]">
              ${formattedPrice(order.total)}
              <span className="ml-1 text-sm font-medium text-zinc-500">COP</span>
            </span>
          </div>
          <Separator className="bg-zinc-200" />
          <p className="text-xs text-zinc-500">
            Los precios son los del momento de la compra. Puedes cancelarlo mientras esté pendiente o confirmado.
          </p>
          {canCancel && <CancelOrderButton orderId={order.id} />}
        </aside>
      </div>
    </div>
  );
}
