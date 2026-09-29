import { EditUserForm } from "@/components/admin/users/edit-user-form";
import { CreateMembershipForm, RenewMembershipForm } from "@/components/admin/memberships/membership-forms";
import { PaymentHistory } from "@/components/admin/memberships/payment-history";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { User } from "@/types";
import { MoreHorizontal } from "lucide-react";

export function UserActionsCell({ user }: { user: User }) {
  const membership = user.gymMembership;
  const fullName = `${user.firstName} ${user.firstLastName}`;
  // Una membresía cancelada se reactiva creando una nueva
  const canCreate = !membership || membership.status === "CANCELLED";

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

        {canCreate ? (
          <DynamicModal
            title="Crear membresía"
            description={fullName}
            trigger={
              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                Crear Membresía
              </DropdownMenuItem>
            }
          >
            {(close) => <CreateMembershipForm userId={user.id} onSuccess={close} />}
          </DynamicModal>
        ) : (
          <DynamicModal
            title="Renovar membresía"
            description={fullName}
            trigger={
              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                Renovar Membresía
              </DropdownMenuItem>
            }
          >
            {(close) => (
              <RenewMembershipForm
                userId={user.id}
                nextPaymentDate={membership.nextPaymentDate}
                onSuccess={close}
              />
            )}
          </DynamicModal>
        )}

        <DynamicModal
          title="Historial de pagos"
          description={fullName}
          size="xl"
          trigger={
            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
              Ver Historial de Pagos
            </DropdownMenuItem>
          }
        >
          <PaymentHistory userId={user.id} />
        </DynamicModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
