"use client";

import { FormEvent, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories, useCategoryMutations } from "@/hooks/categories/use-categories";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { Category } from "@/types";

const inputClass =
  "bg-zinc-100 text-zinc-800 placeholder-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6BFF3C]";

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const { create, update, remove } = useCategoryMutations();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);

  const mutationError = create.error ?? update.error ?? remove.error;

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate(name.trim(), { onSuccess: () => setName("") });
  }

  function handleRename() {
    if (!editing?.name.trim()) return;
    update.mutate({ id: editing.id, name: editing.name.trim() }, { onSuccess: () => setEditing(null) });
  }

  function handleDelete(category: Category) {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    remove.mutate(category.id);
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 p-6">
        <div className="max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <form onSubmit={handleCreate} className="flex gap-2 border-b border-zinc-200 p-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la nueva categoría"
              className={`${inputClass} flex-1`}
            />
            <Button
              type="submit"
              disabled={create.isPending || !name.trim()}
              className="bg-[#6BFF3C] font-semibold text-black hover:bg-[#5de52f]"
            >
              <Plus /> Agregar
            </Button>
          </form>

          {(error || mutationError) && (
            <p className="px-3 pt-3 text-sm text-red-500">{error ?? getApiErrorMessage(mutationError)}</p>
          )}

          {isLoading ? (
            <p className="p-6 text-center text-sm text-zinc-400">Cargando...</p>
          ) : categories.length === 0 ? (
            <p className="p-6 text-center text-sm text-zinc-400">Todavía no hay categorías.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                  {editing?.id === c.id ? (
                    <>
                      <input
                        autoFocus
                        value={editing.name}
                        onChange={(e) => setEditing({ id: c.id, name: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        className={`${inputClass} flex-1`}
                      />
                      <Button size="icon" variant="ghost" onClick={handleRename} aria-label="Guardar">
                        <Check />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(null)} aria-label="Cancelar">
                        <X />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-zinc-800">{c.name}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditing({ id: c.id, name: c.name })}
                        aria-label="Renombrar"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(c)}
                        aria-label="Eliminar"
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-2 text-xs text-zinc-400">Solo se puede borrar una categoría que no tenga productos.</p>
      </main>
    </div>
  );
}
