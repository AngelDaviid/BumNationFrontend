'use client';

import { FormEvent, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { categoriesApi } from '@/lib/api/categories';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import {
  DangerButton,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
} from '@/components/admin/admin-ui';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);
  const { data, error, isLoading, reload } = useAdminQuery(() => categoriesApi.getAll());
  const action = useAdminAction();

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const result = await action.run((token) => categoriesApi.create(name.trim(), token));
    if (result) {
      setName('');
      reload();
    }
  }

  async function handleRename() {
    if (!editing?.name.trim()) return;
    const result = await action.run((token) =>
      categoriesApi.update(editing.id, editing.name.trim(), token),
    );
    if (result) {
      setEditing(null);
      reload();
    }
  }

  async function handleDelete(category: Category) {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    const result = await action.run((token) => categoriesApi.delete(category.id, token));
    if (result !== null) reload();
  }

  const inputClass =
    'rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-[#6BFF3C]';

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Agrupan los productos de la tienda. Solo se puede borrar una categoría sin productos."
      />

      <Panel className="max-w-2xl">
        <form onSubmit={handleCreate} className="flex gap-2 border-b border-zinc-800 p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            className={`${inputClass} flex-1`}
          />
          <PrimaryButton type="submit" size="lg" disabled={action.isPending || !name.trim()}>
            <Plus /> Agregar
          </PrimaryButton>
        </form>

        <div className="p-4 pb-0">
          <ErrorMessage message={error ?? action.error} />
        </div>

        {isLoading && !data ? (
          <LoadingState />
        ) : !data?.length ? (
          <EmptyState>Todavía no hay categorías.</EmptyState>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {data.map((c) => (
              <li key={c.id} className="flex items-center gap-2 px-4 py-3">
                {editing?.id === c.id ? (
                  <>
                    <input
                      autoFocus
                      value={editing.name}
                      onChange={(e) => setEditing({ id: c.id, name: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                      className={`${inputClass} flex-1`}
                    />
                    <PrimaryButton size="icon" onClick={handleRename} aria-label="Guardar">
                      <Check />
                    </PrimaryButton>
                    <SecondaryButton size="icon" onClick={() => setEditing(null)} aria-label="Cancelar">
                      <X />
                    </SecondaryButton>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-zinc-200">{c.name}</span>
                    <SecondaryButton
                      size="icon"
                      onClick={() => setEditing({ id: c.id, name: c.name })}
                      aria-label="Renombrar"
                    >
                      <Pencil />
                    </SecondaryButton>
                    <DangerButton size="icon" onClick={() => handleDelete(c)} aria-label="Eliminar">
                      <Trash2 />
                    </DangerButton>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
