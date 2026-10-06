"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { DeleteCategoryContent } from "@/components/admin/categories/delete-category-content";
import { useCategoryActions } from "@/hooks/categories/use-category-forms";
import { Category } from "@/types";

export function CategoryActionsCell({ category }: { category: Category }) {
  const { register, renameCategory, resetName, deleteCategory, isRenaming, isDeleting } = useCategoryActions(category);

  return (
    <div className="flex justify-center gap-1">
      <DynamicModal
        title="Renombrar categoría"
        description={category.name}
        size="sm"
        trigger={
          <Button size="icon" variant="ghost" onClick={resetName} aria-label="Renombrar">
            <Pencil />
          </Button>
        }
      >
        {(close) => (
          <form onSubmit={renameCategory(close)} className="flex flex-col gap-4">
            <Field label="Nombre">
              <Input registration={register("name")} />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={close}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isRenaming}
              >
                {isRenaming && <Loader size="sm" />}
                {isRenaming ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        )}
      </DynamicModal>

      <DynamicModal
        title="Eliminar categoría"
        description={category.name}
        size="xl"
        trigger={
          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" aria-label="Eliminar">
            <Trash2 />
          </Button>
        }
      >
        {(close) => (
          <DeleteCategoryContent
            category={category}
            onCancel={close}
            onDelete={() => deleteCategory(close)}
            isDeleting={isDeleting}
          />
        )}
      </DynamicModal>
    </div>
  );
}
