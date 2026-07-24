import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api/products';
import { Product } from '@/types/product.types';

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 5;
const DEBOUNCE_MS = 300;

export function useProductSuggestions(query: string) {
  const trimmed = query.trim();
  const shouldFetch = trimmed.length >= MIN_CHARS;

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [completedQuery, setCompletedQuery] = useState<string | null>(null);
  const isLoading = shouldFetch && completedQuery !== trimmed;

  useEffect(() => {
    if (!shouldFetch) return;

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      productsApi
        .getAll({ search: trimmed, limit: MAX_SUGGESTIONS }, { signal: controller.signal })
        .then((response) => {
          setSuggestions(response.data);
          setCompletedQuery(trimmed);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.error(err);
          setCompletedQuery(trimmed);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmed, shouldFetch]);

  return {
    suggestions: shouldFetch ? suggestions : [],
    isLoading,
    showDropdown: shouldFetch,
  };
}