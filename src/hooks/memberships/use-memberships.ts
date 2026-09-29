import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { membershipApi } from "@/lib/api/membership";

export function useMemberships() {
  const { token, hasHydrated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => membershipApi.getAll(token!),
    enabled: !!token,
  });

  return {
    memberships: data ?? [],
    isLoading: !hasHydrated || isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useUserMembership(userId: string | null) {
  const { token } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["memberships", userId],
    queryFn: () => membershipApi.getByUserId(userId!, token!),
    enabled: !!token && !!userId,
    retry: false,
  });

  return {
    membership: data ?? null,
    isLoading,
    error: getApiErrorMessage(error),
  };
}

export function getApiErrorMessage(error: unknown) {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return "Ocurrió un error inesperado";
}
