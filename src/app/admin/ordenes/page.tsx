"use client";

import { DataTable } from "@/components/ui/data-table";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { OrderDetail } from "@/components/admin/orders/order-detail";
import {useAdminOrders} from "@/hooks/orders";
import { useOrderSearch } from "../../../hooks/orders/use-order-search";
import { formatDate } from "@/lib/utils/date";
import { columns } from "@/app/admin/ordenes/columns";

export default function OrdersPage() {
  const { orders, isLoading, error, page, totalPages, nextPage, prevPage } = useAdminOrders({ limit: 10 });
  const { register, onSearch, isSearching, searchError, selected, selectOrder, clearSelected } = useOrderSearch();

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSearch} className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <Input
            inputMode="numeric"
            placeholder="Buscar por número de orden"
            error={searchError ?? undefined}
            registration={register("number")}
          />
        </div>
        {isSearching && <Loader size="sm" tone="light" label="Buscando…" />}
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
          onRowClick={selectOrder}
        />
      </div>

      <DynamicModal
        title={selected ? `Orden #${selected.orderNumber}` : ""}
        description={selected ? formatDate(selected.createdAt) : undefined}
        size="xl"
        mobileLayout="sheet"
        trigger={<span className="hidden" />}
        open={!!selected}
        onOpenChange={(open) => !open && clearSelected()}
      >
        {selected && <OrderDetail key={selected.id} order={selected} />}
      </DynamicModal>
    </div>
  );
}
