import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { categoriesApi } from "@/lib/api/categories";

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  return {
    categories: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useCategoryMutations() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  return {
    create: useMutation({
      mutationFn: (name: string) => categoriesApi.create(name, token!),
      onSuccess,
    }),
    update: useMutation({
      mutationFn: ({ id, name }: { id: number; name: string }) =>
        categoriesApi.update(id, name, token!),
      onSuccess,
    }),
    remove: useMutation({
      mutationFn: (id: number) => categoriesApi.delete(id, token!),
      onSuccess,
    }),
  };
}
