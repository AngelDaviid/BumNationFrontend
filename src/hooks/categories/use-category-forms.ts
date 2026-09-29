import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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

export function useCategoryRow(category: Category) {
  const { update, remove } = useCategoryMutations();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
    defaultValues: { name: category.name },
  });

  const onRename = handleSubmit(({ name }) => {
    if (!name.trim()) return;
    update.mutate({ id: category.id, name: name.trim() }, { onSuccess: () => setIsEditing(false) });
  });

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    reset({ name: category.name });
    setIsEditing(false);
  }

  function deleteCategory(onDeleted: () => void) {
    remove.mutate(category.id, { onSuccess: onDeleted });
  }

  return {
    register,
    isEditing,
    startEditing,
    cancelEditing,
    onRename,
    deleteCategory,
    isRenaming: update.isPending,
    isDeleting: remove.isPending,
  };
}
