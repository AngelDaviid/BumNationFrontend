import {keepPreviousData, useQuery} from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import {useEffect, useState} from "react";
import {ProductListFilters} from "@/types";

interface UseProductsParams extends ProductListFilters {
  categoryId?: string;
  // Búsqueda controlada desde fuera (p. ej. la URL). Si no se pasa, se usa
  // la búsqueda interna con setSearch.
  search?: string;
  page?: number;
  initialPage?: number;
  limit?: number;
}

export function useProducts({ categoryId, search: externalSearch, page: externalPage, initialPage = 1, limit = 10, brand, sort, inStock }: UseProductsParams) {
  const [internalPage, setPage] = useState(initialPage);
  const page = externalPage ?? internalPage;
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
  const filtersKey = [externalSearch, categoryId, brand, sort, inStock].join("|");
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  if (prevFiltersKey !== filtersKey) {
    setPrevFiltersKey(filtersKey);
    setPage(1);
  }

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['products', page, limit, effectiveSearch, categoryId, brand, sort, inStock],
    queryFn: ({ signal }) =>
      productsApi.getAll(page, limit, effectiveSearch || undefined, categoryId, { signal, brand, sort, inStock }),
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
