'use client';

import { FormEvent, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import { formattedDate } from '@/common/formatted-date';
import { formattedPrice } from '@/common/formatted-price';
import {
  AdminSheet,
  DangerButton,
  DataTable,
  EmptyState,
  ErrorMessage,
  LoadingState,
  ORDER_STATUS_LABELS,
  OrderStatusPill,
  PageHeader,
  Pagination,
  Panel,
  SecondaryButton,
  SelectField,
  TextAreaField,
} from '@/components/admin/admin-ui';
import { Order, OrderStatus } from '@/types';

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [searchNumber, setSearchNumber] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const searchAction = useAdminAction();

  const { data, error, isLoading, reload } = useAdminQuery(
    (token) => ordersApi.getAll(token, page, PAGE_SIZE),
    [page],
  );

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const number = Number(searchNumber.replace('#', ''));
    if (!Number.isInteger(number) || number <= 0) return;
    const order = await searchAction.run((token) => ordersApi.searchByNumber(number, token));
    if (order) setSelected(order);
  }

  function handleUpdated(order: Order) {
    // Las respuestas de actualización no traen items ni usuario, se conservan los que ya teníamos
    setSelected((current) => (current ? { ...current, ...order, items: current.items, user: current.user } : null));
    reload();
  }

  const orders = data?.data ?? [];

  return (
    <>
      <PageHeader title="Órdenes" description="Pedidos de la tienda y su estado de despacho." />

      <Panel>
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2 border-b border-zinc-800 p-4">
          <div className="relative w-56">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              inputMode="numeric"
              placeholder="Buscar por número (#)"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pr-3 pl-9 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-[#6BFF3C]"
            />
          </div>
          <SecondaryButton type="submit" size="lg" disabled={searchAction.isPending}>
            Buscar
          </SecondaryButton>
          {searchAction.error && <span className="text-sm text-red-400">{searchAction.error}</span>}
        </form>

        <ErrorMessage message={error} />
        {isLoading && !data ? (
          <LoadingState />
        ) : orders.length === 0 ? (
          <EmptyState>Todavía no hay órdenes.</EmptyState>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="font-mono text-white">#{o.orderNumber}</td>
                  <td>
                    {o.user?.firstName} {o.user?.firstLastName}
                    <div className="text-xs text-zinc-500">{o.user?.phone || o.user?.email}</div>
                  </td>
                  <td>{formattedDate(o.createdAt)}</td>
                  <td>{o.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td>${formattedPrice(o.total)}</td>
                  <td>
                    <OrderStatusPill status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
        <Pagination meta={data?.meta} onPageChange={setPage} />
      </Panel>

      <AdminSheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected ? `Orden #${selected.orderNumber}` : ''}
        description={selected ? formattedDate(selected.createdAt) : undefined}
        wide
      >
        {selected && <OrderDetail key={selected.id} order={selected} onUpdated={handleUpdated} />}
      </AdminSheet>
    </>
  );
}

function OrderDetail({ order, onUpdated }: { order: Order; onUpdated: (order: Order) => void }) {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const statusAction = useAdminAction();
  const cancelAction = useAdminAction();
  const isCancelled = order.status === 'CANCELLED';

  async function handleStatus(status: OrderStatus) {
    const result = await statusAction.run((token) => ordersApi.updateStatus(order.id, status, token));
    if (result) onUpdated(result);
  }

  async function handleCancel() {
    const result = await cancelAction.run((token) =>
      ordersApi.cancelAsAdmin(order.id, cancelReason || undefined, token),
    );
    if (result) {
      setShowCancel(false);
      onUpdated(result);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <OrderStatusPill status={order.status} />
        <span className="text-lg font-bold text-[#6BFF3C]">${formattedPrice(order.total)} COP</span>
      </div>

      {order.user && (
        <div className="rounded-lg bg-zinc-950 p-3 text-sm">
          <p className="font-medium text-white">
            {order.user.firstName} {order.user.firstLastName}
          </p>
          <p className="text-zinc-400">{order.user.email}</p>
          {order.user.phone && <p className="text-zinc-400">{order.user.phone}</p>}
        </div>
      )}

      <div className="rounded-lg border border-zinc-800">
        <DataTable>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product?.name ?? `Producto ${item.productId}`}</td>
                <td>{item.quantity}</td>
                <td>${formattedPrice(item.priceAtTime)}</td>
                <td>${formattedPrice(String(Number(item.priceAtTime) * item.quantity))}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>

      {isCancelled ? (
        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
          Cancelada{order.cancelReason ? `: ${order.cancelReason}` : '.'}
        </p>
      ) : (
        <>
          <SelectField
            label="Cambiar estado"
            value={order.status}
            disabled={statusAction.isPending}
            onChange={(e) => handleStatus(e.target.value as OrderStatus)}
            options={Object.entries(ORDER_STATUS_LABELS)
              .filter(([value]) => value !== 'CANCELLED')
              .map(([value, label]) => ({ value, label }))}
          />
          <ErrorMessage message={statusAction.error} />

          {showCancel ? (
            <div className="flex flex-col gap-3 rounded-lg border border-red-500/30 p-3">
              <TextAreaField
                label="Motivo de cancelación (opcional)"
                value={cancelReason}
                maxLength={500}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <p className="text-xs text-zinc-500">Al cancelar, el stock de los productos se devuelve al inventario.</p>
              <ErrorMessage message={cancelAction.error} />
              <div className="flex gap-2">
                <DangerButton onClick={handleCancel} disabled={cancelAction.isPending}>
                  {cancelAction.isPending ? 'Cancelando…' : 'Confirmar cancelación'}
                </DangerButton>
                <SecondaryButton onClick={() => setShowCancel(false)}>
                  <X /> Volver
                </SecondaryButton>
              </div>
            </div>
          ) : (
            <DangerButton className="self-start" onClick={() => setShowCancel(true)}>
              Cancelar orden
            </DangerButton>
          )}
        </>
      )}
    </>
  );
}
