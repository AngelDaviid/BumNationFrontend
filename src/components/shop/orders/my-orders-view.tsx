"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Package, RotateCw } from "lucide-react";
import { formattedDate } from "@/common/formatted-date";
import { formattedPrice } from "@/common/formatted-price";
import { useMyOrders } from "@/hooks/my-orders";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { OrderStatusPill } from "./order-status-pill";

const pagerButton = "h-10 border-zinc-300 bg-white px-4 text-zinc-700 hover:border-brand hover:text-brand-text";

export function MyOrdersView() {
  const { orders, page, totalPages, isLoading, isFetching, isError, refetch, nextPage, prevPage } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader tone="light" label="Cargando tus pedidos…" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={RotateCw}
        title="No pudimos cargar tus pedidos"
        description="Revisa tu conexión e inténtalo de nuevo."
        action={
          <Button onClick={() => refetch()} className="h-10 px-5">
            <RotateCw /> Reintentar
          </Button>
        }
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Aún no tienes pedidos"
        description="Cuando finalices una compra la verás aquí con su estado."
        action={
          <Button asChild className="h-10 px-5">
            <Link href="/">Ir a la tienda</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {orders.map((order) => {
          const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-brand sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-zinc-900">Pedido #{order.orderNumber}</span>
                    <OrderStatusPill status={order.status} />
                  </div>
                  <p className="text-sm text-zinc-500">
                    {formattedDate(order.createdAt)} · {units} {units === 1 ? "producto" : "productos"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-lg font-bold text-brand-text">${formattedPrice(order.total)}</span>
                  <ChevronRight className="size-5 text-zinc-400" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav aria-label="Paginación" className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={prevPage} disabled={page <= 1 || isFetching} className={pagerButton}>
            <ChevronLeft />
          </Button>
          <span className="text-sm text-zinc-500">
            Página <span className="font-semibold text-zinc-900">{page}</span> de {totalPages}
          </span>
          <Button variant="outline" onClick={nextPage} disabled={page >= totalPages || isFetching} className={pagerButton}>
            <ChevronRight />
          </Button>
        </nav>
      )}
    </div>
  );
}
