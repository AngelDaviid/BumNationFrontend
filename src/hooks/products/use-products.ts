import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api/products';
import { Product } from '@/types/product.types';

interface UseProductsParams {
  search?: string;
  categoryId?: string;
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export function useProducts({ search, categoryId }: UseProductsParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const requestKey = JSON.stringify({ search: search ?? null, categoryId: categoryId ?? null });

  const [completedKey, setCompletedKey] = useState<string | null>(null);
  const isLoading = completedKey !== requestKey;

  useEffect(() => {
    const controller = new AbortController();

    productsApi
      .getAll({ search: search || undefined, categoryId }, { signal: controller.signal })
      .then((response) => {
        setProducts(response.data);
        setError(null);
        setCompletedKey(requestKey);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError('No se pudieron cargar los productos.');
        setCompletedKey(requestKey);
      });

    return () => controller.abort();
  }, [search, categoryId, requestKey]);

  return { products, isLoading, error };
}