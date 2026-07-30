import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/lib/api/users";

export function useUsers({ initialPage = 1, limit = 10 } = {}) {
  const { token } = useAuthStore();
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page, limit, debouncedSearch],
    queryFn: () => usersApi.getAll(token!, page, limit, debouncedSearch),
    enabled: !!token,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.meta.totalPage ?? 1;

  return {
    users: data?.data ?? [],
    total: data?.meta.total ?? 0,
    totalPages,
    page,
    isLoading,
    error: error instanceof Error ? error.message : null,
    search,
    setSearch,
    nextPage: () => setPage((p) => (p < totalPages ? p + 1 : p)),
    prevPage: () => setPage((p) => (p > 1 ? p - 1 : p)),
    goToPage: (target: number) => {
      if (target >= 1 && target <= totalPages) setPage(target);
    },
  };
}