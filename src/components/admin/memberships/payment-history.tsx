"use client";

import { Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/membership/status-badge";
import { formattedPrice } from "@/common/formatted-price";
import { formatDate } from "@/lib/utils/date";
import { useUserMembership } from "@/hooks/memberships/use-memberships";
import { useUpdateMembershipStatus } from "@/hooks/memberships/use-membership-mutations";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { MembershipStatus } from "@/types";

const STATUS_OPTIONS: { value: MembershipStatus; label: string }[] = [
  { value: "ACTIVE", label: "Activo" },
  { value: "EXPIRED", label: "Expirado" },
  { value: "SUSPENDED", label: "Suspendido" },
  { value: "CANCELLED", label: "Cancelado" },
];

// Estado, fechas e historial completo de pagos de la membresía de un usuario
export function PaymentHistory({ userId }: { userId: string }) {
  const { membership, isLoading, error } = useUserMembership(userId);
  const { mutate: updateStatus, isPending, error: statusError } = useUpdateMembershipStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center p-6 text-zinc-400">
        <Loader2 className="animate-spin" size={18} />
      </div>
    );
  }

  if (!membership) {
    return <p className="text-sm text-zinc-500">{error ?? "Este usuario no tiene membresía."}</p>;
  }

  const payments = membership.membershipPayments ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Info label="Estado" value={<StatusBadge status={membership.status} />} />
        <Info label="Miembro desde" value={formatDate(membership.startDate)} />
        <Info label="Próximo pago" value={formatDate(membership.nextPaymentDate)} />
        <Info
          label="Días restantes"
          value={membership.isExpired ? `Vencida hace ${membership.daysSinceExpired}` : membership.daysUntilExpire}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        Cambiar estado
        <select
          value={membership.status}
          disabled={isPending}
          onChange={(e) => updateStatus({ userId, status: e.target.value as MembershipStatus })}
          className="rounded-md bg-zinc-100 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#6BFF3C]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {statusError && <p className="text-sm text-red-500">{getApiErrorMessage(statusError)}</p>}

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-xs">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2 text-left">Pagado</th>
              <th className="px-3 py-2 text-left">Valor</th>
              <th className="px-3 py-2 text-left">Periodo</th>
              <th className="px-3 py-2 text-left">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-14 text-center text-zinc-400">
                  Sin pagos registrados.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2">{formatDate(p.paidAt)}</td>
                  <td className="px-3 py-2">${formattedPrice(p.amount)}</td>
                  <td className="px-3 py-2">
                    {formatDate(p.validFrom)} – {formatDate(p.validUntil)}
                  </td>
                  <td className="px-3 py-2 text-zinc-500">{p.notes || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-zinc-400">{label}</p>
      <div className="mt-0.5 text-zinc-800">{value}</div>
    </div>
  );
}
