"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/categories/use-categories";
import { useCategorySearch, useCreateCategoryForm } from "@/hooks/categories/use-category-forms";
import { columns } from "@/app/admin/categorias/columns";

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const { register, onSubmit, canSubmit } = useCreateCategoryForm();
  const { search, setSearch, visible } = useCategorySearch(categories);

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 space-y-4 p-6">
        <form onSubmit={onSubmit} className="flex max-w-xl items-end gap-2">
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

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <DataTable
            columns={columns}
            data={visible}
            isLoading={isLoading}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar categoría..."
          />
        </div>
        <p className="text-xs text-zinc-400">Solo se puede borrar una categoría que no tenga productos.</p>
      </main>
    </div>
  );
}
