'use client';

import Link from 'next/link';
import { useState } from 'react';
import { membershipApi } from '@/lib/api/membership';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { formattedDate } from '@/common/formatted-date';
import { formattedPrice } from '@/common/formatted-price';
import { RenewMembershipForm } from '@/components/admin/membership-forms';
import {
  AdminSheet,
  DataTable,
  EmptyState,
  ErrorMessage,
  LoadingState,
  MembershipStatusPill,
  PageHeader,
  Panel,
  PrimaryButton,
} from '@/components/admin/admin-ui';
import { MembershipWithStats } from '@/types';
import { cn } from '@/lib/utils';

const FILTERS = {
  all: { label: 'Todas', match: () => true },
  active: {
    label: 'Al día',
    match: (m: MembershipWithStats) => m.status === 'ACTIVE' && !m.isExpired && !m.isAboutToExpire,
  },
  expiring: {
    label: 'Por vencer',
    match: (m: MembershipWithStats) => m.status === 'ACTIVE' && m.isAboutToExpire,
  },
  expired: {
    label: 'Vencidas',
    match: (m: MembershipWithStats) => m.status === 'EXPIRED' || (m.status === 'ACTIVE' && m.isExpired),
  },
  suspended: { label: 'Suspendidas', match: (m: MembershipWithStats) => m.status === 'SUSPENDED' },
  cancelled: { label: 'Canceladas', match: (m: MembershipWithStats) => m.status === 'CANCELLED' },
};

type FilterKey = keyof typeof FILTERS;

export default function AdminMembershipsPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [renewing, setRenewing] = useState<MembershipWithStats | null>(null);
  const { data, error, isLoading, reload } = useAdminQuery((token) => membershipApi.getAll(token));

  const memberships = (data ?? []).filter(FILTERS[filter].match);

  return (
    <>
      <PageHeader
        title="Membresías"
        description="Controla renovaciones y pagos del gimnasio. Para crear una membresía, abre el usuario desde Usuarios."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(FILTERS) as FilterKey[]).map((key) => {
          const count = (data ?? []).filter(FILTERS[key].match).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
                filter === key
                  ? 'border-[#6BFF3C] bg-[#6BFF3C]/10 text-[#6BFF3C]'
                  : 'border-zinc-700 text-zinc-400 hover:text-white',
              )}
            >
              {FILTERS[key].label} <span className="text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <Panel>
        <ErrorMessage message={error} />
        {isLoading && !data ? (
          <LoadingState />
        ) : memberships.length === 0 ? (
          <EmptyState>No hay membresías en esta vista.</EmptyState>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Estado</th>
                <th>Próximo pago</th>
                <th>Días restantes</th>
                <th>Último pago</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => {
                const lastPayment = m.membershipPayments?.[0];
                return (
                  <tr key={m.id}>
                    <td>
                      <Link
                        href={`/admin/users/${m.userId}`}
                        className="font-medium text-white hover:text-[#6BFF3C]"
                      >
                        {m.user?.firstName} {m.user?.firstLastName}
                      </Link>
                      <div className="text-xs text-zinc-500">{m.user?.phone || m.user?.email}</div>
                    </td>
                    <td>
                      <MembershipStatusPill
                        status={m.status}
                        isExpired={m.isExpired}
                        isAboutToExpire={m.isAboutToExpire}
                      />
                    </td>
                    <td>{formattedDate(m.nextPaymentDate)}</td>
                    <td className={m.isExpired ? 'text-red-400' : m.isAboutToExpire ? 'text-amber-300' : ''}>
                      {m.isExpired ? 'Vencida' : m.daysUntilExpire}
                    </td>
                    <td>
                      {lastPayment ? (
                        <>
                          ${formattedPrice(lastPayment.amount)}
                          <div className="text-xs text-zinc-500">{formattedDate(lastPayment.paidAt)}</div>
                        </>
                      ) : (
                        <span className="text-zinc-500">Sin pagos</span>
                      )}
                    </td>
                    <td className="text-right">
                      {m.status !== 'CANCELLED' && (
                        <PrimaryButton size="sm" onClick={() => setRenewing(m)}>
                          Renovar
                        </PrimaryButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </Panel>

      <AdminSheet
        open={!!renewing}
        onOpenChange={(open) => !open && setRenewing(null)}
        title="Renovar membresía"
        description={renewing ? `${renewing.user?.firstName} ${renewing.user?.firstLastName}` : undefined}
      >
        {renewing && (
          <RenewMembershipForm
            key={renewing.id}
            userId={renewing.userId}
            nextPaymentDate={renewing.nextPaymentDate}
            onDone={() => {
              setRenewing(null);
              reload();
            }}
          />
        )}
      </AdminSheet>
    </>
  );
}
