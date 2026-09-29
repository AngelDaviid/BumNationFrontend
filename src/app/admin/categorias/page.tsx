"use client";

import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useCategories, useCategoryMutations } from "@/hooks/categories/use-categories";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { Category } from "@/types";

interface CategoryFormValues {
  name: string;
}

function CategoryRow({ category }: { category: Category }) {
  const { update, remove } = useCategoryMutations();
  const rowError = update.error ?? remove.error;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
    defaultValues: { name: category.name },
  });

  const onRename = ({ name }: CategoryFormValues) => {
    if (!name.trim()) return;
    update.mutate({ id: category.id, name: name.trim() }, { onSuccess: () => setIsEditing(false) });
  };

  function handleCancel() {
    reset({ name: category.name });
    setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    remove.mutate(category.id);
  }

  if (isEditing) {
    return (
      <li className="px-3 py-2">
        <form onSubmit={handleSubmit(onRename)} className="flex items-center gap-2">
          <div className="flex-1">
            <Input registration={register("name")} />
          </div>
          <Button type="submit" size="icon" variant="ghost" disabled={update.isPending} aria-label="Guardar">
            <Check />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={handleCancel} aria-label="Cancelar">
            <X />
          </Button>
        </form>
        {rowError && <p className="mt-1 text-xs text-red-500">{getApiErrorMessage(rowError)}</p>}
      </li>
    );
  }

  return (
    <li className="px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
      <span className="flex-1 text-zinc-800">{category.name}</span>
      <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} aria-label="Renombrar">
        <Pencil />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-red-500 hover:text-red-600"
        onClick={handleDelete}
        disabled={remove.isPending}
        aria-label="Eliminar"
      >
        <Trash2 />
      </Button>
      </div>
      {rowError && <p className="mt-1 text-xs text-red-500">{getApiErrorMessage(rowError)}</p>}
    </li>
  );
}

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const { create } = useCategoryMutations();
  const { register, handleSubmit, reset, control } = useForm<CategoryFormValues>({
    defaultValues: { name: "" },
  });

  const name = useWatch({ control, name: "name" });

  const onCreate = ({ name }: CategoryFormValues) => {
    if (!name.trim()) return;
    create.mutate(name.trim(), { onSuccess: () => reset() });
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 p-6">
        <div className="max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <form onSubmit={handleSubmit(onCreate)} className="flex items-end gap-2 border-b border-zinc-200 p-3">
            <div className="flex-1">
              <Field label="Nueva categoría">
                <Input placeholder="Nombre de la categoría" registration={register("name")} />
              </Field>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={create.isPending || !name?.trim()}
              className="bg-[#6BFF3C] font-semibold text-black hover:bg-[#5de52f]"
            >
              <Plus /> Agregar
            </Button>
          </form>

          {(error || create.error) && (
            <p className="px-3 pt-3 text-sm text-red-500">{error ?? getApiErrorMessage(create.error)}</p>
          )}

          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader tone="light" label="Cargando categorías…" />
            </div>
          ) : categories.length === 0 ? (
            <p className="p-6 text-center text-sm text-zinc-400">Todavía no hay categorías.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {categories.map((c) => (
                <CategoryRow key={c.id} category={c} />
              ))}
            </ul>
          )}
        </div>
        <p className="mt-2 text-xs text-zinc-400">Solo se puede borrar una categoría que no tenga productos.</p>
      </main>
    </div>
  );
}
