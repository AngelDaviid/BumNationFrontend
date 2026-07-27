import { MembershipStatus, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"



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

function StatusBadge({ status }: { status: MembershipStatus | null }) {
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
            const startDate = getValue<string | null>();
            if (!startDate) return "No inscrito";
            return new Date(startDate).toLocaleDateString("es-ES");
        },
    },
    {
        id: "nextPaymentDate",
        header: "Próximo pago",
        accessorFn: (row) => row.gymMembership?.nextPaymentDate ?? null,
        cell: ({ getValue }) => {
            const nextPaymentDate = getValue<string | null>();
            if (!nextPaymentDate) return "No inscrito";
            return new Date(nextPaymentDate).toLocaleDateString("es-ES");
        },
    },
    {
      accessorKey: "membershipStats.daysUntilExpire",
      header: "Días Restantes",
      cell: ({ row }) => {
        const daysUntilExpire = row.original.membershipStats?.daysUntilExpire;
        if (daysUntilExpire === 0) return "Expirado";
        if (!daysUntilExpire) return "No inscrito";
        return daysUntilExpire;
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
    cell: ({  }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">Acciones</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">Editar Usuario</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Ver Historial de Pagos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]