import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/stores/search.store';
import { useProductSuggestions } from './use-products-suggestions';

export function useProductSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnProductsPage = pathname === '/products';

  const query = useSearchStore((state) => state.query);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setQueryImmediate = useSearchStore((state) => state.setQueryImmediate);

  const [hasSyncedFromUrl, setHasSyncedFromUrl] = useState(false);
  if (isOnProductsPage && !hasSyncedFromUrl) {
    setHasSyncedFromUrl(true);
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== query) {
      setQueryImmediate(urlSearch);
    }
  }

  useEffect(() => {
    if (!isOnProductsPage) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set('search', debouncedQuery);
    } else {
      params.delete('search');
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, isOnProductsPage]);

  const { suggestions, isLoading: isLoadingSuggestions, showDropdown } =
    useProductSuggestions(query);

  const handleSubmit = (e: React.FormEvent, onClose?: () => void) => {
    e.preventDefault();
    if (!query.trim()) return;

    setQueryImmediate(query);
    onClose?.();

    if (!isOnProductsPage) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  /** const handleSelectSuggestion = (productId: number, onClose?: () => void) => {
    onClose?.();
    router.push(`/products/${productId}`);
  }; **/

  return {
    query,
    setQuery,
    handleSubmit,
    suggestions,
    isLoadingSuggestions,
    showDropdown,
    //onSelectSuggestion: handleSelectSuggestion,
  };
}