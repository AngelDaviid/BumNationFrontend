import {keepPreviousData, useQuery} from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import {useEffect, useState} from "react";

interface UseProductsParams {
  categoryId?: string;
  // Búsqueda controlada desde fuera (p. ej. la URL). Si no se pasa, se usa
  // la búsqueda interna con setSearch.
  search?: string;
  initialPage?: number;
  limit?: number;
}

export function useProducts({ categoryId, search: externalSearch, initialPage = 1, limit = 10 }: UseProductsParams) {
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

  const effectiveSearch = externalSearch ?? debouncedSearch;

  // Vuelve a la primera página cuando cambian los filtros externos
  const [prevFilters, setPrevFilters] = useState({ externalSearch, categoryId });
  if (prevFilters.externalSearch !== externalSearch || prevFilters.categoryId !== categoryId) {
    setPrevFilters({ externalSearch, categoryId });
    setPage(1);
  }

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['products', page, limit, effectiveSearch, categoryId],
    queryFn: () => productsApi.getAll(page, limit, effectiveSearch || undefined, categoryId),
    placeholderData: keepPreviousData
  });

  const totalPages = data?.meta.totalPage ?? 1

  return {
    products: data?.data ?? [],
    total: data?.meta.total ?? 0,
    totalPages,
    page,
    isLoading,
    isFetching,
    error: error instanceof Error ? 'No se pudieron cargar los productos.' : null,
    refetch,
    search,
    setSearch,
    nextPage: () => setPage((p) => (p < totalPages ? p + 1 : p )),
    prevPage: () => setPage((p) => ( p > 1 ? p - 1 : p )),
    goToPage: (target: number) => {
      if (target >= 1 && target <= totalPages) setPage(target);
    },
  };
}
