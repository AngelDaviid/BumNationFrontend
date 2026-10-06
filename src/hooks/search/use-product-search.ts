"use client";

import { usePathname, useRouter } from "next/navigation";
import { useListParams } from "@/hooks/use-list-params";
import { useProductSuggestions } from "./use-products-suggestions";

const PRODUCTS_PATH = "/products";

export function useProductSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const isOnProductsPage = pathname === PRODUCTS_PATH;

  const { search: query, setSearch: setQuery, commitSearch } = useListParams({ liveSearch: isOnProductsPage });

  const { suggestions, isLoading: isLoadingSuggestions, showDropdown } =
      useProductSuggestions(query);

  const handleSubmit = (event: React.FormEvent, onClose?: () => void) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    onClose?.();

    if (isOnProductsPage) commitSearch();
    else router.push(`${PRODUCTS_PATH}?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const selectSuggestion = (productId: number, onClose?: () => void) => {
    onClose?.();
    router.push(`${PRODUCTS_PATH}/${productId}`);
  };

  return {
    query,
    setQuery,
    handleSubmit,
    selectSuggestion,
    suggestions,
    isLoadingSuggestions,
    showDropdown,
  };
}
