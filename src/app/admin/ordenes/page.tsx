"use client";

import { FormEvent, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
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
  const [number, setNumber] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
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
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            inputMode="numeric"
            placeholder="Buscar por número de orden"
            className="w-56 rounded-md bg-white px-3 py-1.5 text-xs text-zinc-800 outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-[#6BFF3C]"
          />
          <Button type="submit" variant="outline" size="sm">
            Buscar
          </Button>
          {searchError && <span className="text-xs text-red-500">{searchError}</span>}
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
