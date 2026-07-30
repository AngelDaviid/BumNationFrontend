import {keepPreviousData, useQuery} from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import {useAuthStore} from "@/stores/auth.store";
import {useEffect, useState} from "react";

interface UseProductsParams {
  categoryId?: string;
  initialPage?: number;
  limit?: number;
}

export function useProducts({ categoryId, initialPage = 1, limit = 10 }: UseProductsParams) {
  const { token } = useAuthStore();
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', search, categoryId],
    queryFn: () => productsApi.getAll(token!, page, limit, debouncedSearch, categoryId),
    enabled: !!token,
    placeholderData: keepPreviousData
  });

  const totalPages = data?.meta.totalPage ?? 1

  return {
    products: data?.data ?? [],
    total: data?.meta.total ?? 0,
    totalPages,
    page,
    isLoading,
    error: error instanceof Error ? 'No se pudieron cargar los productos.' : null,
    search,
    setSearch,
    nextPage: () => setPage((p) => (p < totalPages ? p + 1 : p )),
    prevPage: () => setPage((p) => ( p > 1 ? p - 1 : p )),
  };
}