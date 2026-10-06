import { useForm, useWatch } from "react-hook-form";
import { useListParams } from "@/hooks/admin/use-list-params";
import { useCategoryMutations } from "@/hooks/categories/use-categories";
import { Category } from "@/types";

interface CategoryFormValues {
  name: string;
}

export function useCreateCategoryForm() {
  const { create } = useCategoryMutations();
  const { register, handleSubmit, reset, control } = useForm<CategoryFormValues>({
    defaultValues: { name: "" },
  });
  const name = useWatch({ control, name: "name" });

  const onSubmit = handleSubmit(({ name }) => {
    if (!name.trim()) return;
    create.mutate(name.trim(), { onSuccess: () => reset() });
  });

  return {
    register,
    onSubmit,
    isPending: create.isPending,
    canSubmit: !!name?.trim() && !create.isPending,
  };
}

export function useCategoryActions(category: Category) {
  const { update, remove } = useCategoryMutations();
  const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
    defaultValues: { name: category.name },
  });

  const renameCategory = (onRenamed: () => void) =>
    handleSubmit(({ name }) => {
      if (!name.trim()) return;
      update.mutate({ id: category.id, name: name.trim() }, { onSuccess: onRenamed });
    });

  function resetName() {
    reset({ name: category.name });
  }

  function deleteCategory(onDeleted: () => void) {
    remove.mutate(category.id, { onSuccess: onDeleted });
  }

  return {
    register,
    renameCategory,
    resetName,
    deleteCategory,
    isRenaming: update.isPending,
    isDeleting: remove.isPending,
  };
}

export function useCategorySearch(categories: Category[]) {
  const { search, setSearch } = useListParams();
  const term = search.trim().toLowerCase();
  const visible = term ? categories.filter((c) => c.name.toLowerCase().includes(term)) : categories;

  return { search, setSearch, visible };
}
