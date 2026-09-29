'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { useAdminQuery } from '@/hooks/admin/use-admin-query';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import { formattedPrice } from '@/common/formatted-price';
import { ProductForm } from '@/components/admin/product-form';
import {
  AdminSheet,
  DangerButton,
  DataTable,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Pagination,
  Panel,
  PrimaryButton,
  SecondaryButton,
} from '@/components/admin/admin-ui';
import { Product } from '@/types';

const PAGE_SIZE = 20;
const LOW_STOCK_THRESHOLD = 5;

export default function AdminInventoryPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const deleteAction = useAdminAction();

  const productsQuery = useAdminQuery(
    () => productsApi.getAll({ page, limit: PAGE_SIZE }),
    [page],
  );
  const categoriesQuery = useAdminQuery(() => categoriesApi.getAll());

  async function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}" del inventario?`)) return;
    const result = await deleteAction.run((token) => productsApi.delete(product.id, token));
    if (result !== null) productsQuery.reload();
  }

  const products = productsQuery.data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Inventario"
        description="Productos de la tienda, precios y stock disponible."
        actions={
          <PrimaryButton size="lg" onClick={() => setEditing('new')}>
            <Plus /> Nuevo producto
          </PrimaryButton>
        }
      />

      <Panel>
        <ErrorMessage message={productsQuery.error ?? deleteAction.error} />
        {productsQuery.isLoading && !productsQuery.data ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState>Todavía no hay productos. Crea el primero.</EmptyState>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-zinc-800">
                        {p.imageUrl && (
                          <Image src={p.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        {p.brand && <p className="text-xs text-zinc-500">{p.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td>{p.category?.name ?? '—'}</td>
                  <td>${formattedPrice(p.price)}</td>
                  <td>
                    <StockEditor product={p} onSaved={productsQuery.reload} />
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <SecondaryButton size="icon" onClick={() => setEditing(p)} aria-label="Editar">
                        <Pencil />
                      </SecondaryButton>
                      <DangerButton
                        size="icon"
                        onClick={() => handleDelete(p)}
                        disabled={deleteAction.isPending}
                        aria-label="Eliminar"
                      >
                        <Trash2 />
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
        <Pagination meta={productsQuery.data?.meta} onPageChange={setPage} />
      </Panel>

      <AdminSheet
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing === 'new' ? 'Nuevo producto' : 'Editar producto'}
      >
        {editing && (
          <ProductForm
            key={editing === 'new' ? 'new' : editing.id}
            product={editing === 'new' ? undefined : editing}
            categories={categoriesQuery.data ?? []}
            onDone={() => {
              setEditing(null);
              productsQuery.reload();
            }}
          />
        )}
      </AdminSheet>
    </>
  );
}

// Ajuste rápido de stock sin abrir el formulario completo
function StockEditor({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const [stock, setStock] = useState(product.stock);
  const { run, isPending, error } = useAdminAction();
  const isDirty = stock !== product.stock;

  async function save() {
    const result = await run((token) => productsApi.update(product.id, { stock }, token));
    if (result) onSaved();
  }

  const tone =
    stock === 0 ? 'text-red-400' : stock <= LOW_STOCK_THRESHOLD ? 'text-amber-300' : 'text-white';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setStock((s) => Math.max(0, s - 1))}
          className="cursor-pointer rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          aria-label="Restar uno"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Math.max(0, Number(e.target.value) || 0))}
          className={`w-16 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-center text-sm outline-none focus:ring-2 focus:ring-[#6BFF3C] ${tone}`}
        />
        <button
          type="button"
          onClick={() => setStock((s) => s + 1)}
          className="cursor-pointer rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          aria-label="Sumar uno"
        >
          <Plus size={14} />
        </button>
        {isDirty && (
          <PrimaryButton size="xs" onClick={save} disabled={isPending}>
            {isPending ? '…' : 'Guardar'}
          </PrimaryButton>
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
