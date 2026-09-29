'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { ArrowLeft, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { membershipApi } from '@/lib/api/membership';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import { formattedDate } from '@/common/formatted-date';
import { formattedPrice } from '@/common/formatted-price';
import { UserForm } from '@/components/admin/user-form';
import { CreateMembershipForm, RenewMembershipForm } from '@/components/admin/membership-forms';
import {
  AdminSheet,
  DangerButton,
  DataTable,
  EmptyState,
  ErrorMessage,
  LoadingState,
  MEMBERSHIP_STATUS_LABELS,
  MembershipStatusPill,
  PageHeader,
  Panel,
  Pill,
  PrimaryButton,
  SecondaryButton,
  SelectField,
} from '@/components/admin/admin-ui';
import { MembershipStatus } from '@/types';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sheet, setSheet] = useState<'edit' | 'renew' | 'create' | null>(null);
  const deleteAction = useAdminAction();
  const statusAction = useAdminAction();

  const userQuery = useAdminQuery((token) => usersApi.getById(id, token), [id]);
  const membershipQuery = useAdminQuery(
    // Un 404 significa que el usuario todavía no tiene membresía
    (token) =>
      membershipApi.getByUserId(id, token).catch((err) => {
        if (err?.statusCode === 404) return null;
        throw err;
      }),
    [id],
  );

  const user = userQuery.data;
  const membership = membershipQuery.data;

  async function handleDelete() {
    if (!user) return;
    if (!confirm(`¿Eliminar a ${user.firstName} ${user.firstLastName}? Esta acción no se puede deshacer.`)) {
      return;
    }
    const result = await deleteAction.run((token) => usersApi.deleteUser(user.id, token));
    if (result) router.replace('/admin/users');
  }

  async function handleStatusChange(status: MembershipStatus) {
    const result = await statusAction.run((token) => membershipApi.updateStatus(id, status, token));
    if (result) membershipQuery.reload();
  }

  function closeAndReload() {
    setSheet(null);
    membershipQuery.reload();
  }

  if (userQuery.isLoading && !user) return <LoadingState />;
  if (userQuery.error) return <ErrorMessage message={userQuery.error} />;
  if (!user) return null;

  return (
    <>
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={16} /> Usuarios
      </Link>
      <PageHeader
        title={[user.firstName, user.middleName, user.firstLastName, user.secondLastName]
          .filter(Boolean)
          .join(' ')}
        description={`Registrado el ${formattedDate(user.createdAt)}`}
        actions={
          <>
            <SecondaryButton size="lg" onClick={() => setSheet('edit')}>
              <Pencil /> Editar
            </SecondaryButton>
            <DangerButton size="lg" onClick={handleDelete} disabled={deleteAction.isPending}>
              <Trash2 /> Eliminar
            </DangerButton>
          </>
        }
      />
      <ErrorMessage message={deleteAction.error} />

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <Panel className="p-5">
          <h2 className="mb-4 font-semibold text-white">Datos</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <Info label="Identificación" value={user.identification} />
            <Info label="Email" value={user.email} />
            <Info label="Teléfono" value={user.phone || '—'} />
            <Info
              label="Rol"
              value={
                <Pill tone={user.role === 'ADMIN' ? 'violet' : 'zinc'}>
                  {user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                </Pill>
              }
            />
          </dl>
        </Panel>

        <Panel className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-white">Membresía del gimnasio</h2>
            {membership && membership.status !== 'CANCELLED' && (
              <PrimaryButton onClick={() => setSheet('renew')}>
                <RefreshCw /> Renovar
              </PrimaryButton>
            )}
          </div>

          {membershipQuery.isLoading && membership === null ? (
            <LoadingState />
          ) : membershipQuery.error ? (
            <ErrorMessage message={membershipQuery.error} />
          ) : !membership ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-zinc-400">Este usuario no tiene membresía.</p>
              <PrimaryButton onClick={() => setSheet('create')}>Crear membresía</PrimaryButton>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <Info
                  label="Estado"
                  value={
                    <MembershipStatusPill
                      status={membership.status}
                      isExpired={membership.isExpired}
                      isAboutToExpire={membership.isAboutToExpire}
                    />
                  }
                />
                <Info label="Miembro desde" value={formattedDate(membership.startDate)} />
                <Info label="Próximo pago" value={formattedDate(membership.nextPaymentDate)} />
                <Info
                  label="Días restantes"
                  value={membership.isExpired ? 'Vencida' : membership.daysUntilExpire}
                />
              </div>

              <div className="mt-5 flex items-end gap-3">
                <SelectField
                  label="Cambiar estado"
                  className="w-48"
                  value={membership.status}
                  disabled={statusAction.isPending}
                  onChange={(e) => handleStatusChange(e.target.value as MembershipStatus)}
                  options={Object.entries(MEMBERSHIP_STATUS_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </div>
              <div className="mt-2">
                <ErrorMessage message={statusAction.error} />
              </div>

              <h3 className="mt-6 mb-2 text-sm font-semibold text-white">Historial de pagos</h3>
              {!membership.membershipPayments?.length ? (
                <EmptyState>Sin pagos registrados.</EmptyState>
              ) : (
                <DataTable>
                  <thead>
                    <tr>
                      <th>Pagado</th>
                      <th>Valor</th>
                      <th>Periodo</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membership.membershipPayments.map((p) => (
                      <tr key={p.id}>
                        <td>{formattedDate(p.paidAt)}</td>
                        <td>${formattedPrice(p.amount)}</td>
                        <td>
                          {formattedDate(p.validFrom)} – {formattedDate(p.validUntil)}
                        </td>
                        <td className="text-zinc-400">{p.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              )}
            </>
          )}
        </Panel>
      </div>

      <AdminSheet open={sheet === 'edit'} onOpenChange={() => setSheet(null)} title="Editar usuario">
        <UserForm
          user={user}
          onDone={() => {
            setSheet(null);
            userQuery.reload();
          }}
        />
      </AdminSheet>
      <AdminSheet
        open={sheet === 'create'}
        onOpenChange={() => setSheet(null)}
        title="Crear membresía"
        description={`${user.firstName} ${user.firstLastName}`}
      >
        <CreateMembershipForm userId={user.id} onDone={closeAndReload} />
      </AdminSheet>
      {membership && (
        <AdminSheet
          open={sheet === 'renew'}
          onOpenChange={() => setSheet(null)}
          title="Renovar membresía"
          description={`${user.firstName} ${user.firstLastName}`}
        >
          <RenewMembershipForm
            userId={user.id}
            nextPaymentDate={membership.nextPaymentDate}
            onDone={closeAndReload}
          />
        </AdminSheet>
      )}
    </>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-zinc-200">{value}</dd>
    </div>
  );
}
