"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { StatusSelect } from "@/components/admin/selecteables/status-select";
import { useCategoryProducts } from "@/hooks/categories/use-category-products";
import { Category } from "@/types";

interface DeleteCategoryContentProps {
  category: Category;
  onCancel: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function DeleteCategoryContent({ category, onCancel, onDelete, isDeleting }: DeleteCategoryContentProps) {
  const { products, total, isLoading, canDelete, otherCategories, moveProduct, isMoving } =
    useCategoryProducts(category);

  return (
    <div className="flex flex-col gap-4 text-sm">
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader tone="light" label="Revisando productos…" />
        </div>
      ) : products.length > 0 ? (
        <>
          <p className="text-zinc-600">
            <span className="font-semibold">{category.name}</span> tiene {total}{" "}
            {total === 1 ? "producto" : "productos"}. Muévelos a otra categoría para poder eliminarla.
          </p>
          <ul className="max-h-72 divide-y divide-zinc-100 overflow-y-auto rounded-lg border border-zinc-200">
            {products.map((product) => (
              <li key={product.id} className="flex flex-wrap items-center gap-3 px-3 py-2">
                <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  {product.imageUrl && (
                    <Image src={product.imageUrl} alt={product.name} fill sizes="36px" className="object-cover" />
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-zinc-800">{product.name}</span>
                <div className="w-full shrink-0 sm:w-56">
                  <StatusSelect
                    value=""
                    placeholder="Mover a…"
                    options={otherCategories}
                    disabled={isMoving || otherCategories.length === 0}
                    onChange={(categoryId) => moveProduct(product.id, categoryId)}
                  />
                </div>
              </li>
            ))}
          </ul>
          {otherCategories.length === 0 && (
            <p className="text-xs text-zinc-500">Crea otra categoría para poder mover estos productos.</p>
          )}
        </>
      ) : (
        <p className="text-zinc-600">
          ¿Seguro que quieres eliminar la categoría <span className="font-semibold">{category.name}</span>? No tiene
          productos asignados.
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={!canDelete || isDeleting}>
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>
    </div>
  );
}
