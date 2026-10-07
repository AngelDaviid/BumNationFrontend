import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/lib/api/users";

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useUsers({ page = 1, limit = 10, search = "" }: UseUsersParams = {}) {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => usersApi.getAll(page, limit, search),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });

  return {
    users: data?.data ?? [],
    total: data?.meta.total ?? 0,
    totalPages: data?.meta.totalPage ?? 1,
    isLoading: !hasHydrated || isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
