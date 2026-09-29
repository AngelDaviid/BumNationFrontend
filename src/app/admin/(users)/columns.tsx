import { MembershipStatus, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { UserActionsCell } from "./user-actions-cell";
import { StatusBadge } from "@/components/membership/status-badge";
import {formatDateOnly} from "@/lib/utils/date";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="cursor-pointer"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className="cursor-pointer"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "status",
    header: "Estado",
    accessorFn: (row) => row.gymMembership?.status ?? null,
    cell: ({ getValue }) => (
      <StatusBadge status={getValue<MembershipStatus | null>()} />
    ),
  },
  {
    id: "startDate",
    header: "Fecha de inicio",
    accessorFn: (row) => row.gymMembership?.startDate ?? null,
    cell: ({ getValue }) => {
      const startDate = formatDateOnly(getValue<string | null>(), "No inscrito");
      return startDate;
    },
  },
  {
    id: "nextPaymentDate",
    header: "Próximo pago",
    accessorFn: (row) => row.gymMembership?.nextPaymentDate ?? null,
    cell: ({ getValue }) => {
      const nextPaymentDate = formatDateOnly(getValue<string | null>(), "No inscrito");
      return nextPaymentDate;
    },
  },
  {
    accessorKey: "membershipStats.daysUntilExpire",
    header: "Días Restantes",
    cell: ({ row }) => {
      const daysUntilExpire = row.original.membershipStats?.daysUntilExpire;
      if (daysUntilExpire === 0) return "Expirado";
      if (!daysUntilExpire) return "No inscrito";
      return daysUntilExpire + 1;
    }
  },
  {
    accessorKey: "identification",
    header: "Identificación",
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
  },
  {
    accessorKey: "firstLastName",
    header: "Apellido",
  },
  {
    accessorKey: "email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ getValue }) => {
      const phone = getValue<string | null>();
      if (!phone) return "No registrado";
      return phone;
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
]