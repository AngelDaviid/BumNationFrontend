import {ColumnDef} from "@tanstack/react-table";
import {MembershipWithStats} from "@/types";
import {StatusBadge} from "@/components/membership/status-badge";
import {formatDate} from "@/lib/utils/date";
import {formattedPrice} from "@/common/formatted-price";
import {DynamicModal} from "@/components/ui/dynamic-modal";
import {Button} from "@/components/ui/button";
import {PaymentHistory} from "@/components/admin/memberships/payment-history";
import {RenewMembershipForm} from "@/components/admin/memberships/renew-membership-formt";

export const memberName = (m: MembershipWithStats) => `${m.user?.firstName ?? ""} ${m.user?.firstLastName ?? ""}`;

export const columns: ColumnDef<MembershipWithStats>[] = [
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