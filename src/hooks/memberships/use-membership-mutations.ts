import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipApi } from "@/lib/api/membership";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { CreateMembershipData, MembershipStatus, RenewMembershipData } from "@/types";

function useInvalidateMemberships() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["memberships"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["users-stats"] });
  };
}

export function useCreateMembership() {
  const invalidate = useInvalidateMemberships();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateMembershipData }) =>
      membershipApi.create(userId, data),
    onSuccess: () => {
      invalidate();
      toast.success("Membresía creada");
    },
    onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo crear la membresía"),
  });
}

export function useRenewMembership() {
  const invalidate = useInvalidateMemberships();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RenewMembershipData }) =>
      membershipApi.renew(userId, data),
    onSuccess: () => {
      invalidate();
      toast.success("Pago registrado, membresía renovada");
    },
    onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo renovar la membresía"),
  });
}

export function useUpdateMembershipStatus() {
  const invalidate = useInvalidateMemberships();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: MembershipStatus }) =>
      membershipApi.updateStatus(userId, status),
    onSuccess: () => {
      invalidate();
      toast.success("Estado de la membresía actualizado");
    },
    onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo cambiar el estado de la membresía"),
  });
}
