'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { productsApi } from '@/lib/api/products';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import { Category, Product } from '@/types';
import {
  ErrorMessage,
  PrimaryButton,
  SelectField,
  TextAreaField,
  TextField,
} from './admin-ui';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onDone: (product: Product) => void;
}

// Crea o edita un producto y, si se eligió, sube su imagen a Cloudinary
export function ProductForm({ product, categories, onDone }: ProductFormProps) {
  const [values, setValues] = useState({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    description: product?.description ?? '',
    price: product ? String(Number(product.price)) : '',
    stock: product ? String(product.stock) : '0',
    categoryId: String(product?.categoryId ?? categories[0]?.id ?? ''),
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.imageUrl ?? null);
  const { run, isPending, error, setError } = useAdminAction();

  const set =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede pesar más de 5 MB.');
      return;
    }
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : (product?.imageUrl ?? null));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.categoryId) return setError('Primero crea una categoría.');

    const data = {
      name: values.name,
      brand: values.brand || undefined,
      description: values.description || undefined,
      price: Number(values.price),
      stock: Number(values.stock),
      categoryId: Number(values.categoryId),
    };

    const result = await run(async (token) => {
      const saved = product
        ? await productsApi.update(product.id, data, token)
        : await productsApi.create(data, token);
      return image ? productsApi.uploadImage(saved.id, image, token) : saved;
    });
    if (result) onDone(result);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField label="Nombre" value={values.name} onChange={set('name')} required />
      <TextField label="Marca" value={values.brand} onChange={set('brand')} />
      <TextAreaField label="Descripción" value={values.description} onChange={set('description')} />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Precio (COP)"
          type="number"
          min={0}
          step="0.01"
          value={values.price}
          onChange={set('price')}
          required
        />
        <TextField
          label="Stock"
          type="number"
          min={0}
          step={1}
          value={values.stock}
          onChange={set('stock')}
          required
        />
      </div>
      <SelectField
        label="Categoría"
        value={values.categoryId}
        onChange={set('categoryId')}
        options={
          categories.length
            ? categories.map((c) => ({ value: String(c.id), label: c.name }))
            : [{ value: '', label: 'No hay categorías' }]
        }
      />
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-400">Imagen (JPG, PNG o WEBP, máx. 5 MB)</span>
        <div className="flex items-center gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
            {preview && <Image src={preview} alt="" fill sizes="80px" className="object-cover" unoptimized />}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImage}
            className="text-sm text-zinc-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200"
          />
        </div>
      </label>
      <ErrorMessage message={error} />
      <PrimaryButton type="submit" disabled={isPending} size="lg">
        {isPending ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
      </PrimaryButton>
    </form>
  );
}
