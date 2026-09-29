import { EditUserForm } from "@/components/admin/users/edit-user-form";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { User } from "@/types";
import { MoreHorizontal } from "lucide-react";

export function UserActionsCell({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
          Acciones
        </DropdownMenuLabel>

        <DynamicModal
          title=""
          size="xl" 
          trigger={
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()} 
            >
              Editar Usuario
            </DropdownMenuItem>
          }
        >
          {(close) => (
            <EditUserForm
              userId={user.id}
              defaultValues={{
                email: user.email,
                firstName: user.firstName,
                firstLastName: user.firstLastName,
                middleName: user.middleName ?? "",
                secondLastName: user.secondLastName ?? "",
                identification: user.identification,
                phone: user.phone ?? "",
              }}
              imageUrl={user.imageUrl ?? ""}
              onSuccess={close}
            />
          )}
        </DynamicModal>

        <DropdownMenuItem className="cursor-pointer">
          Ver Historial de Pagos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}