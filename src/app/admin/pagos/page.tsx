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


  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Membresías" value={stats.total} isLoading={isLoading} />
        <StatCard
          label="Activas al día"
          value={stats.activeUpToDate}
          accent
          isLoading={isLoading}
        />
        <StatCard label="Por vencer (7 días)" value={stats.expiring} isLoading={isLoading} />
        <StatCard label="Vencidas" value={stats.expired} isLoading={isLoading} />
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
    </div>
  );
}
