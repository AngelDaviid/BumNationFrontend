"use client";

import { StatusBadge } from "@/components/membership/status-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { Field } from "@/components/ui/field";
import { Loader } from "@/components/ui/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export function PaymentHistory({ userId }: { userId: string }) {
  const { membership, isLoading, error } = useUserMembership(userId);
  const { mutate: updateStatus, isPending, error: statusError } = useUpdateMembershipStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader size="sm" tone="light" />
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

      <Field label="Cambiar estado" error={getApiErrorMessage(statusError) ?? undefined}>
        <StatusSelect
          value={membership.status}
          options={STATUS_OPTIONS}
          disabled={isPending}
          onChange={(status) => updateStatus({ userId, status })}
        />
      </Field>

      <div className="rounded-lg border border-zinc-200">
        <Table className="text-xs">
          <TableHeader className="bg-zinc-50 text-[11px] uppercase tracking-wide">
            <TableRow>
              <TableHead className="text-zinc-500">Pagado</TableHead>
              <TableHead className="text-zinc-500">Valor</TableHead>
              <TableHead className="text-zinc-500">Periodo</TableHead>
              <TableHead className="text-zinc-500">Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-14 text-center text-zinc-400">
                  Sin pagos registrados.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{formatDate(p.paidAt)}</TableCell>
                  <TableCell>${formattedPrice(p.amount)}</TableCell>
                  <TableCell>
                    {formatDate(p.validFrom)} – {formatDate(p.validUntil)}
                  </TableCell>
                  <TableCell className="text-zinc-500">{p.notes || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
