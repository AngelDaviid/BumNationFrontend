import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { membershipApi } from "@/lib/api/membership";
import { CreateMembershipData, MembershipStatus, RenewMembershipData } from "@/types";

// Tras cualquier cambio se refrescan membresías, usuarios y sus estadísticas
function useInvalidateMemberships() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["memberships"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["users-stats"] });
  };
}

export function useCreateMembership() {
  const { token } = useAuthStore();
  const invalidate = useInvalidateMemberships();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateMembershipData }) =>
      membershipApi.create(userId, data, token!),
    onSuccess: invalidate,
  });
}

export function useRenewMembership() {
  const { token } = useAuthStore();
  const invalidate = useInvalidateMemberships();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RenewMembershipData }) =>
      membershipApi.renew(userId, data, token!),
    onSuccess: invalidate,
  });
}

export function useUpdateMembershipStatus() {
  const { token } = useAuthStore();
  const invalidate = useInvalidateMemberships();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: MembershipStatus }) =>
      membershipApi.updateStatus(userId, status, token!),
    onSuccess: invalidate,
  });
}
