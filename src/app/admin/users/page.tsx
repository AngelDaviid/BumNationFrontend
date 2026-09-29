'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { formattedDate } from '@/common/formatted-date';
import { UserForm } from '@/components/admin/user-form';
import {
  AdminSheet,
  DataTable,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Pagination,
  Panel,
  Pill,
  PrimaryButton,
} from '@/components/admin/admin-ui';

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { data, error, isLoading } = useAdminQuery(
    (token) => usersApi.getAll(token, page, PAGE_SIZE),
    [page],
  );

  const term = filter.trim().toLowerCase();
  const users = (data?.data ?? []).filter((u) =>
    !term
      ? true
      : [u.firstName, u.firstLastName, u.email, u.identification, u.phone]
          .join(' ')
          .toLowerCase()
          .includes(term),
  );

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Personas registradas en la tienda y el gimnasio."
        actions={
          <PrimaryButton onClick={() => setIsCreating(true)} size="lg">
            <Plus /> Nuevo usuario
          </PrimaryButton>
        }
      />

      <Panel>
        <div className="border-b border-zinc-800 p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar en esta página por nombre, email o cédula"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pr-3 pl-9 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-[#6BFF3C]"
            />
          </div>
        </div>

        <ErrorMessage message={error} />
        {isLoading && !data ? (
          <LoadingState />
        ) : users.length === 0 ? (
          <EmptyState>No hay usuarios para mostrar.</EmptyState>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Identificación</th>
                <th>Contacto</th>
                <th>Rol</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/users/${u.id}`)}
                >
                  <td>
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="font-medium text-white hover:text-[#6BFF3C]"
                    >
                      {u.firstName} {u.firstLastName}
                    </Link>
                  </td>
                  <td className="font-mono text-xs">{u.identification}</td>
                  <td>
                    <div>{u.email}</div>
                    <div className="text-xs text-zinc-500">{u.phone}</div>
                  </td>
                  <td>
                    <Pill tone={u.role === 'ADMIN' ? 'violet' : 'zinc'}>
                      {u.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                    </Pill>
                  </td>
                  <td>{formattedDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
        <Pagination meta={data?.meta} onPageChange={setPage} />
      </Panel>

      <AdminSheet open={isCreating} onOpenChange={setIsCreating} title="Nuevo usuario">
        <UserForm onDone={(user) => router.push(`/admin/users/${user.id}`)} />
      </AdminSheet>
    </>
  );
}
