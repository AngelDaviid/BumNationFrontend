"use client";

import { columns } from "./columns";
import { useUsers } from "@/hooks/users/use-all-users";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { useUserStats } from "@/hooks/users/use-users-stats";

export default function AllUsersPage() {
  const { users, isLoading, error, page, totalPages, nextPage, prevPage, search, setSearch } =
    useUsers({ limit: 10 });

  const { total, active, withoutMembership } = useUserStats();

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total usuarios" value={total} />
            <StatCard label="Activos" value={active} accent />
            <StatCard label="Sin membresía" value={withoutMembership} />
            <StatCard label="Próximos a vencer" value="—" />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
            <DataTable
              columns={columns}
              data={users}
              isLoading={isLoading}
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Buscar por identificación..."
              page={page}
              totalPages={totalPages}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}