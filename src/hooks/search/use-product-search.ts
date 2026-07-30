"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearchStore } from "@/stores/search.store";
import { useProductSuggestions } from "./use-products-suggestions";

const PRODUCTS_PATH = "/products";

export function useProductSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnProductsPage = pathname === PRODUCTS_PATH;

  const query = useSearchStore((state) => state.query);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setQueryImmediate = useSearchStore((state) => state.setQueryImmediate);

  const searchParamsRef = useRef(searchParams);
  // eslint-disable-next-line react-hooks/refs
  searchParamsRef.current = searchParams;

  const hasSyncedFromUrl = useRef(false);

  useEffect(() => {
    if (!isOnProductsPage || hasSyncedFromUrl.current) return;
    hasSyncedFromUrl.current = true;

    const urlSearch = searchParams.get("search") ?? "";
    if (urlSearch !== query) {
      setQueryImmediate(urlSearch);
    }
  }, [isOnProductsPage, searchParams, query, setQueryImmediate]);

  useEffect(() => {
    if (!isOnProductsPage) return;

    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (debouncedQuery) {
      params.set("search", debouncedQuery);
    } else {
      params.delete("search");
    }

    router.replace(`${PRODUCTS_PATH}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, isOnProductsPage, router]);

  const { suggestions, isLoading: isLoadingSuggestions, showDropdown } =
      useProductSuggestions(query);

  const handleSubmit = (event: React.FormEvent, onClose?: () => void) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setQueryImmediate(trimmedQuery);
    onClose?.();

    if (!isOnProductsPage) {
      router.push(`${PRODUCTS_PATH}?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return {
    query,
    setQuery,
    handleSubmit,
    suggestions,
    isLoadingSuggestions,
    showDropdown,
  };
}