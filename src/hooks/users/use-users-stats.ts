import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/lib/api/users";

export function useUserStats() {
  const { token } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users-stats"],
    queryFn: () => usersApi.getStats(token!), 
    enabled: !!token,
    staleTime: 1000 * 60, 
  });

  const total = data?.total || 0;
  const active = data?.active || 0;
  const withoutMembership = data?.withoutMembership || 0;

  return {
    total,
    active,
    withoutMembership,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}