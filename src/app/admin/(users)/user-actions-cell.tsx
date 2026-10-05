"use client";

import { useState } from "react";
import { EditUserForm } from "@/components/admin/users/edit-user-form";
import { CreateMembershipForm } from "@/components/admin/memberships/membership-forms";
import { PaymentHistory } from "@/components/admin/memberships/payment-history";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { User } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { RenewMembershipForm } from "@/components/admin/memberships/renew-membership-form";

type UserAction = "edit" | "membership" | "history";

export function UserActionsCell({ user }: { user: User }) {
  const [action, setAction] = useState<UserAction | null>(null);

  const membership = user.gymMembership;
  const fullName = `${user.firstName} ${user.firstLastName}`;
  const canCreate = !membership || membership.status === "CANCELLED";

  const close = () => setAction(null);
  const modalProps = (target: UserAction) => ({
    open: action === target,
    onOpenChange: (open: boolean) => setAction(open ? target : null),
  });

  return (
    <>
      <DropdownMenu modal={false}>
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
          <DropdownMenuItem className="cursor-pointer" onSelect={() => setAction("edit")}>
            Editar Usuario
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onSelect={() => setAction("membership")}>
            {canCreate ? "Crear Membresía" : "Renovar Membresía"}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onSelect={() => setAction("history")}>
            Ver Historial de Pagos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DynamicModal title="Editar usuario" size="lg" mobileLayout="center" {...modalProps("edit")}>
        <EditUserForm user={user} onSuccess={close} onCancel={close} />
      </DynamicModal>

      <DynamicModal
        title={canCreate ? "Crear membresía" : "Renovar membresía"}
        description={fullName}
        {...modalProps("membership")}
      >
        {canCreate ? (
          <CreateMembershipForm userId={user.id} onSuccess={close} />
        ) : (
          <RenewMembershipForm userId={user.id} nextPaymentDate={membership.nextPaymentDate} onSuccess={close} />
        )}
      </DynamicModal>

      <DynamicModal
        title="Historial de pagos"
        description={fullName}
        size="xl"
        mobileLayout="sheet"
        closeOnOutsideClick
        {...modalProps("history")}
      >
        <PaymentHistory userId={user.id} readOnly />
      </DynamicModal>
    </>
  );
}
