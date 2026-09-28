"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, PackageSearch, RotateCw } from "lucide-react";
import { Category, Product } from "@/types";
import { categoriesApi } from "@/lib/api/categories";
import { useProducts } from "@/hooks/products/use-products";
import ProductCard from "@/components/shop/product-cart";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { CategoryFilter } from "@/components/shop/category-filter";
import { Loader } from "@/components/ui/loader";

const PAGE_SIZE = 12;

export function ProductsCatalog() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim() || undefined;
  const categoryId = searchParams.get("category") || undefined;

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const { products, total, page, totalPages, isLoading, isFetching, error, refetch, nextPage, prevPage } =
    useProducts({ search, categoryId, limit: PAGE_SIZE });

  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  const buildHref = (nextCategoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategoryId) params.set("category", nextCategoryId);
    else params.delete("category");
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  const handleAddToCart = (product: Product) => {
    // TODO: conectar con el carrito cuando esté listo
    toast.info(`"${product.name}" se agregará al carrito próximamente`);
  };

  const title = search
    ? `Resultados para "${search}"`
    : activeCategory?.name ?? "Todos los productos";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6BFF3C]">Tienda</p>
            <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          </div>

          <div className="flex h-6 items-center gap-3 text-sm text-zinc-400">
            {isFetching && !isLoading && <Loader size="sm" />}
            {!isLoading && !error && (
              <span>
                {total} {total === 1 ? "producto" : "productos"}
              </span>
            )}
          </div>
        </div>

        {search && (
          <Link
            href={activeCategory ? `/products?category=${activeCategory.id}` : "/products"}
            className="inline-block text-sm text-zinc-400 underline-offset-4 hover:text-[#6BFF3C] hover:underline"
          >
            Quitar búsqueda
          </Link>
        )}

        <CategoryFilter categories={categories} activeCategoryId={categoryId} buildHref={buildHref} />
      </header>

      {isLoading ? (
        <ProductGridSkeleton count={PAGE_SIZE} />
      ) : error ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-white">{error}</p>
          <p className="text-sm text-zinc-400">Revisa tu conexión e inténtalo de nuevo.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#6BFF3C] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#5de52f]"
          >
            <RotateCw size={16} />
            Reintentar
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
          <PackageSearch size={40} className="text-zinc-600" strokeWidth={1.5} />
          <p className="text-lg font-semibold text-white">No encontramos productos</p>
          <p className="text-sm text-zinc-400">
            {search ? "Prueba con otra búsqueda o cambia de categoría." : "Aún no hay productos en esta categoría."}
          </p>
          <Link
            href="/products"
            className="mt-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-[#6BFF3C] hover:text-[#6BFF3C]"
          >
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 justify-items-center gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Paginación" className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prevPage}
                disabled={page <= 1 || isFetching}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-[#6BFF3C] hover:text-[#6BFF3C] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <span className="text-sm text-zinc-400">
                Página <span className="font-semibold text-white">{page}</span> de {totalPages}
              </span>
              <button
                type="button"
                onClick={nextPage}
                disabled={page >= totalPages || isFetching}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-[#6BFF3C] hover:text-[#6BFF3C] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
