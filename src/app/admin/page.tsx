'use client';

import Link from 'next/link';
import { usersApi } from '@/lib/api/users';
import { ordersApi } from '@/lib/api/orders';
import { membershipApi } from '@/lib/api/membership';
import { productsApi } from '@/lib/api/products';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { formattedPrice } from '@/common/formatted-price';
import { formattedDate } from '@/common/formatted-date';
import {
  DataTable,
  EmptyState,
  ErrorMessage,
  LoadingState,
  MembershipStatusPill,
  OrderStatusPill,
  PageHeader,
  Panel,
  StatCard,
} from '@/components/admin/admin-ui';

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboardPage() {
  const { data, error, isLoading } = useAdminQuery(async (token) => {
    const [users, orders, memberships, products] = await Promise.all([
      usersApi.getAll(token, 1, 1),
      ordersApi.getAll(token, 1, 100),
      membershipApi.getAll(token),
      productsApi.getAll({ page: 1, limit: 100 }),
    ]);
    return { users, orders, memberships, products };
  });

  if (isLoading && !data) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const pendingOrders = data.orders.data.filter((o) =>
    ['PENDING_CONFIRMATION', 'CONFIRMED', 'AWAITING_PAYMENT', 'PAID'].includes(o.status),
  );
  const activeMemberships = data.memberships.filter((m) => m.status === 'ACTIVE' && !m.isExpired);
  const expiringSoon = data.memberships.filter(
    (m) => m.status === 'ACTIVE' && (m.isAboutToExpire || m.isExpired),
  );
  const lowStock = data.products.data.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

  return (
    <>
      <PageHeader title="Resumen" description="Estado general del gimnasio y la tienda." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Usuarios registrados" value={data.users.meta.total} />
        <StatCard
          label="Membresías activas"
          value={activeMemberships.length}
          hint={`${data.memberships.length} en total`}
        />
        <StatCard
          label="Por renovar"
          value={expiringSoon.length}
          hint="Vencidas o vencen en 7 días"
          tone={expiringSoon.length ? 'warning' : 'default'}
        />
        <StatCard
          label="Productos con poco stock"
          value={lowStock.length}
          hint={`${LOW_STOCK_THRESHOLD} unidades o menos`}
          tone={lowStock.length ? 'danger' : 'default'}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="Membresías por renovar" href="/admin/memberships" />
          {expiringSoon.length === 0 ? (
            <EmptyState>Ninguna membresía por vencer.</EmptyState>
          ) : (
            <DataTable compact>
              <thead>
                <tr>
                  <th>Miembro</th>
                  <th>Próximo pago</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {expiringSoon.slice(0, 6).map((m) => (
                  <tr key={m.id}>
                    <td>
                      <Link href={`/admin/users/${m.userId}`} className="hover:text-[#6BFF3C]">
                        {m.user?.firstName} {m.user?.firstLastName}
                      </Link>
                    </td>
                    <td>{formattedDate(m.nextPaymentDate)}</td>
                    <td>
                      <MembershipStatusPill
                        status={m.status}
                        isExpired={m.isExpired}
                        isAboutToExpire={m.isAboutToExpire}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </Panel>

        <Panel>
          <SectionTitle title="Órdenes por atender" href="/admin/orders" />
          {pendingOrders.length === 0 ? (
            <EmptyState>No hay órdenes pendientes.</EmptyState>
          ) : (
            <DataTable compact>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono">#{o.orderNumber}</td>
                    <td>
                      {o.user?.firstName} {o.user?.firstLastName}
                    </td>
                    <td>${formattedPrice(o.total)}</td>
                    <td>
                      <OrderStatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <SectionTitle title="Productos con poco stock" href="/admin/inventory" />
          {lowStock.length === 0 ? (
            <EmptyState>Todo el inventario tiene stock suficiente.</EmptyState>
          ) : (
            <DataTable compact>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category?.name}</td>
                    <td className={p.stock === 0 ? 'font-semibold text-red-400' : 'text-amber-300'}>
                      {p.stock === 0 ? 'Agotado' : p.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </Panel>
      </div>
    </>
  );
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <h2 className="font-semibold text-white">{title}</h2>
      <Link href={href} className="text-xs text-[#6BFF3C] hover:underline">
        Ver todo
      </Link>
    </div>
  );
}
