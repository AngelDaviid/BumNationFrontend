"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { useMemberships } from "@/hooks/memberships/use-memberships";
import {
  MEMBERSHIP_FILTER_KEYS,
  MEMBERSHIP_FILTERS,
  useMembershipFilters,
} from "@/hooks/memberships/use-membership-filters";
import { columns } from "@/app/admin/pagos/columns";

export default function MembershipsPage() {
  const { memberships, isLoading, error } = useMemberships();
  const { filter, setFilter, search, setSearch, visible, count, stats } = useMembershipFilters(memberships);

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  const stat = (value: number) => (isLoading ? "…" : value);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Membresías" value={stat(stats.total)} />
          <StatCard
            label="Activas al día"
            value={stat(stats.activeUpToDate)}
            accent
          />
          <StatCard label="Por vencer (7 días)" value={stat(stats.expiring)} />
          <StatCard label="Vencidas" value={stat(stats.expired)} />
        </div>

        <div className="flex flex-wrap gap-2">
          {MEMBERSHIP_FILTER_KEYS.map((key) => (
            <Button
              key={key}
              size="sm"
              variant="outline"
              onClick={() => setFilter(key)}
              className={`rounded-full ${
                filter === key ? "border-[#6BFF3C] bg-[#6BFF3C]/15 text-[#3f9c1f] hover:bg-[#6BFF3C]/25" : "text-zinc-500"
              }`}
            >
              {MEMBERSHIP_FILTERS[key].label} <span className="opacity-60">{isLoading ? "" : count(key)}</span>
            </Button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <DataTable
            columns={columns}
            data={visible}
            isLoading={isLoading}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nombre, email o teléfono..."
          />
        </div>
      </main>
    </div>
  );
}
