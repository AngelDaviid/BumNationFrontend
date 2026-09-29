"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useCategories } from "@/hooks/categories/use-categories";
import { useCategoryRow, useCreateCategoryForm } from "@/hooks/categories/use-category-forms";
import { Category } from "@/types";

function CategoryRow({ category }: { category: Category }) {
  const { register, isEditing, startEditing, cancelEditing, onRename, deleteCategory, isRenaming, isDeleting } =
    useCategoryRow(category);

  if (isEditing) {
    return (
      <li className="px-3 py-2">
        <form onSubmit={onRename} className="flex items-center gap-2">
          <div className="flex-1">
            <Input registration={register("name")} />
          </div>
          <Button type="submit" size="icon" variant="ghost" disabled={isRenaming} aria-label="Guardar">
            <Check />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={cancelEditing} aria-label="Cancelar">
            <X />
          </Button>
        </form>
      </li>
    );
  }

  return (
    <li className="px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
      <span className="flex-1 text-zinc-800">{category.name}</span>
      <Button size="icon" variant="ghost" onClick={startEditing} aria-label="Renombrar">
        <Pencil />
      </Button>
      <DynamicModal
        title="Eliminar categoría"
        description={category.name}
        size="sm"
        trigger={
          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" aria-label="Eliminar">
            <Trash2 />
          </Button>
        }
      >
        {(close) => (
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-zinc-600">
              ¿Seguro que quieres eliminar la categoría <span className="font-semibold">{category.name}</span>? Solo
              se puede borrar si no tiene productos.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={close}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => deleteCategory(close)} disabled={isDeleting}>
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        )}
      </DynamicModal>
      </div>
    </li>
  );
}

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const { register, onSubmit, canSubmit } = useCreateCategoryForm();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 p-6">
        <div className="max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <form onSubmit={onSubmit} className="flex items-end gap-2 border-b border-zinc-200 p-3">
            <div className="flex-1">
              <Field label="Nueva categoría">
                <Input placeholder="Nombre de la categoría" registration={register("name")} />
              </Field>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="bg-[#6BFF3C] font-semibold text-black hover:bg-[#5de52f]"
            >
              <Plus /> Agregar
            </Button>
          </form>

          {error && <p className="px-3 pt-3 text-sm text-red-500">{error}</p>}

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
