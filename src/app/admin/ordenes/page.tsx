"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { OrderDetail } from "@/components/admin/orders/order-detail";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { useAdminOrders } from "@/hooks/orders/use-admin-orders";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/stores/auth.store";
import { formattedPrice } from "@/common/formatted-price";
import { formatDate } from "@/lib/utils/date";
import { Order } from "@/types";

const columns: ColumnDef<Order>[] = [
  { id: "number", header: "#", cell: ({ row }) => <span className="font-mono">#{row.original.orderNumber}</span> },
  {
    id: "customer",
    header: "Cliente",
    cell: ({ row }) => `${row.original.user?.firstName ?? ""} ${row.original.user?.firstLastName ?? ""}`,
  },
  { id: "date", header: "Fecha", cell: ({ row }) => formatDate(row.original.createdAt) },
  {
    id: "items",
    header: "Productos",
    cell: ({ row }) => row.original.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  { id: "total", header: "Total", cell: ({ row }) => `$${formattedPrice(row.original.total)}` },
  { id: "status", header: "Estado", cell: ({ row }) => <OrderStatusBadge status={row.original.status} /> },
];

export default function OrdersPage() {
  const { orders, isLoading, error, page, totalPages, nextPage, prevPage } = useAdminOrders({ limit: 10 });
  const { token } = useAuthStore();
  const [selected, setSelected] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<{ number: string }>({ defaultValues: { number: "" } });

  async function handleSearch({ number }: { number: string }) {
    const orderNumber = Number(number.replace("#", ""));
    if (!token || !Number.isInteger(orderNumber) || orderNumber <= 0) return;
    setSearchError(null);
    try {
      setSelected(await ordersApi.searchByNumber(orderNumber, token));
    } catch (err) {
      setSearchError(getApiErrorMessage(err));
    }
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 space-y-4 p-6">
        <form onSubmit={handleSubmit(handleSearch)} className="flex flex-wrap items-start gap-2">
          <div className="w-64">
            <Input
              inputMode="numeric"
              placeholder="Buscar por número de orden"
              error={searchError ?? undefined}
              registration={register("number")}
            />
          </div>
          <Button type="submit" variant="outline" size="lg">
            Buscar
          </Button>
        </form>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onRowClick={setSelected}
          />
        </div>

        <DynamicModal
          title={selected ? `Orden #${selected.orderNumber}` : ""}
          description={selected ? formatDate(selected.createdAt) : undefined}
          size="xl"
          trigger={<span className="hidden" />}
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          {selected && <OrderDetail key={selected.id} order={selected} />}
        </DynamicModal>
      </main>
    </div>
  );
}
