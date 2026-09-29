import { MembershipStatus } from "@/types";

const statusStyles: Record<MembershipStatus, string> = {
  ACTIVE: "bg-[#6BFF3C]/15 text-[#3f9c1f]",
  EXPIRED: "bg-red-300 text-red-600",
  SUSPENDED: "bg-amber-100 text-amber-600",
  CANCELLED: "bg-red-100 text-red-600",
};

const statusLabels: Record<MembershipStatus, string> = {
  ACTIVE: "Activo",
  EXPIRED: "Expirado",
  SUSPENDED: "Suspendido",
  CANCELLED: "Cancelado",
};

export function StatusBadge({ status }: { status: MembershipStatus | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-400">
        Sin membresía
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}