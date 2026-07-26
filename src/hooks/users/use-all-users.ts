import { useState, useEffect } from "react";
import { User } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/lib/api/users";

interface UseUsersOptions {
  initialPage?: number;
  limit?: number;
}

export function useUsers({ initialPage = 1, limit = 10 }: UseUsersOptions = {}) {
  const { token } = useAuthStore();

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await usersApi.getAll(token, page, limit, debouncedSearch);

        if (!ignore) {
          setUsers(response.data);
          setTotal(response.meta.total);
          setTotalPages(response.meta.totalPage);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error al obtener los usuarios");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [token, page, limit, debouncedSearch, refetchIndex]);

  const nextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToPage = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      setPage(targetPage);
    }
  };

  const refetch = () => {
    setRefetchIndex((prev) => prev + 1);
  };

  return {
    users,
    page,
    totalPages,
    total,
    isLoading,
    error,
    search,
    setSearch,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  };
}