"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/membership/status-badge";
import { RenewMembershipForm } from "@/components/admin/memberships/membership-forms";
import { PaymentHistory } from "@/components/admin/memberships/payment-history";
import { useMemberships } from "@/hooks/memberships/use-memberships";
import { formattedPrice } from "@/common/formatted-price";
import { formatDate } from "@/lib/utils/date";
import { MembershipWithStats } from "@/types";

const FILTERS = {
  all: { label: "Todas", match: () => true },
  expiring: {
    label: "Por vencer",
    match: (m: MembershipWithStats) => m.status === "ACTIVE" && m.isAboutExpire,
  },
  expired: {
    label: "Vencidas",
    match: (m: MembershipWithStats) => m.status === "EXPIRED" || (m.status === "ACTIVE" && m.isExpired),
  },
  suspended: { label: "Suspendidas", match: (m: MembershipWithStats) => m.status === "SUSPENDED" },
  cancelled: { label: "Canceladas", match: (m: MembershipWithStats) => m.status === "CANCELLED" },
};

type FilterKey = keyof typeof FILTERS;

const memberName = (m: MembershipWithStats) => `${m.user?.firstName ?? ""} ${m.user?.firstLastName ?? ""}`;

const columns: ColumnDef<MembershipWithStats>[] = [
  {
    id: "member",
    header: "Miembro",
    cell: ({ row }) => (
      <div className="text-left">
        <p className="font-medium">{memberName(row.original)}</p>
        <p className="text-zinc-400">{row.original.user?.phone || row.original.user?.email}</p>
      </div>
    ),
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "nextPaymentDate",
    header: "Próximo pago",
    cell: ({ row }) => formatDate(row.original.nextPaymentDate),
  },
  {
    id: "days",
    header: "Días restantes",
    cell: ({ row }) => {
      const m = row.original;
      if (m.isExpired) return <span className="text-red-500">Vencida hace {m.daysSinceExpired}</span>;
      return <span className={m.isAboutExpire ? "text-amber-600 font-medium" : ""}>{m.daysUntilExpire}</span>;
    },
  },
  {
    id: "lastPayment",
    header: "Último pago",
    cell: ({ row }) => {
      const last = row.original.membershipPayments?.[0];
      if (!last) return <span className="text-zinc-400">Sin pagos</span>;
      return `$${formattedPrice(last.amount)} · ${formatDate(last.paidAt)}`;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <MembershipActions membership={row.original} />,
  },
];

function MembershipActions({ membership }: { membership: MembershipWithStats }) {
  return (
    <div className="flex justify-center gap-2">
      {membership.status !== "CANCELLED" && (
        <DynamicModal
          title="Renovar membresía"
          description={memberName(membership)}
          trigger={
            <Button size="sm" className="h-7 bg-[#6BFF3C] px-2 text-xs font-semibold text-black hover:bg-[#5de52f]">
              Renovar
            </Button>
          }
        >
          {(close) => (
            <RenewMembershipForm
              userId={membership.userId}
              nextPaymentDate={membership.nextPaymentDate}
              onSuccess={close}
            />
          )}
        </DynamicModal>
      )}
      <DynamicModal
        title="Historial de pagos"
        description={memberName(membership)}
        size="xl"
        trigger={
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
            Historial
          </Button>
        }
      >
        <PaymentHistory userId={membership.userId} />
      </DynamicModal>
    </div>
  );
}

export default function MembershipsPage() {
  const { memberships, isLoading, error } = useMemberships();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  const count = (key: FilterKey) => memberships.filter(FILTERS[key].match).length;
  const term = search.trim().toLowerCase();
  const visible = memberships
    .filter(FILTERS[filter].match)
    .filter((m) => !term || `${memberName(m)} ${m.user?.email} ${m.user?.phone}`.toLowerCase().includes(term));

  const stat = (value: number) => (isLoading ? "…" : value);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Membresías" value={stat(memberships.length)} />
          <StatCard
            label="Activas al día"
            value={stat(memberships.filter((m) => m.status === "ACTIVE" && !m.isExpired).length)}
            accent
          />
          <StatCard label="Por vencer (7 días)" value={stat(count("expiring"))} />
          <StatCard label="Vencidas" value={stat(count("expired"))} />
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
            <Button
              key={key}
              size="sm"
              variant="outline"
              onClick={() => setFilter(key)}
              className={`rounded-full ${
                filter === key ? "border-[#6BFF3C] bg-[#6BFF3C]/15 text-[#3f9c1f] hover:bg-[#6BFF3C]/25" : "text-zinc-500"
              }`}
            >
              {FILTERS[key].label} <span className="opacity-60">{isLoading ? "" : count(key)}</span>
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
