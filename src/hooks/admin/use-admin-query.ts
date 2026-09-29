import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api/client';

interface UseAdminQueryResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

// Ejecuta una petición autenticada del panel de admin y vuelve a pedirla cuando cambian las dependencias
export function useAdminQuery<T>(
  fetcher: (token: string) => Promise<T>,
  deps: unknown[] = [],
): UseAdminQueryResult<T> {
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // Igual que en useProducts: está cargando mientras la última petición no haya terminado
  const requestKey = JSON.stringify([token, version, ...deps]);
  const [completedKey, setCompletedKey] = useState<string | null>(null);
  const isLoading = completedKey !== requestKey;

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    fetcher(token)
      .then((result) => {
        if (!isMounted) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      })
      .finally(() => {
        if (isMounted) setCompletedKey(requestKey);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  return { data, error, isLoading, reload };
}
