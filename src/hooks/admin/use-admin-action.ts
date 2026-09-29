import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api/client';

// Envuelve una acción del admin (crear, editar, borrar) con su estado de carga y error
export function useAdminAction() {
  const token = useAuthStore((state) => state.token);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run<T>(action: (token: string) => Promise<T>): Promise<T | null> {
    if (!token) {
      setError('Tu sesión expiró. Vuelve a iniciar sesión.');
      return null;
    }
    setIsPending(true);
    setError(null);
    try {
      return await action(token);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsPending(false);
    }
  }

  return { run, isPending, error, setError };
}
