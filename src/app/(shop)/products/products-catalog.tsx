"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch, RotateCw } from "lucide-react";
import { useProducts } from "@/hooks/products/use-products";
import { useCatalogFilters } from "@/hooks/shop/use-catalog-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { CategoryFilter } from "@/components/shop/category-filter";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/utils";

const PAGE_SIZE = 12;

const outlineButton =
  "h-10 border-zinc-700 bg-transparent px-4 text-zinc-300 hover:border-[#6BFF3C] hover:bg-transparent hover:text-[#6BFF3C]";

export function ProductsCatalog() {
  const { search, categoryId, categories, title, buildCategoryHref, clearSearchHref } = useCatalogFilters();

  const { products, total, page, totalPages, isLoading, isFetching, error, refetch, nextPage, prevPage } =
    useProducts({ search, categoryId, limit: PAGE_SIZE });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
      <header className="space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6BFF3C]">Tienda</p>
            <h1 className="mt-1 break-words text-2xl font-bold text-white sm:text-4xl">{title}</h1>
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
            href={clearSearchHref}
            className="inline-block text-sm text-zinc-400 underline-offset-4 hover:text-[#6BFF3C] hover:underline"
          >
            Quitar búsqueda
          </Link>
        )}

        <CategoryFilter categories={categories} activeCategoryId={categoryId} buildHref={buildCategoryHref} />
      </header>

      {isLoading ? (
        <ProductGridSkeleton count={PAGE_SIZE} />
      ) : error ? (
        <EmptyState
          icon={RotateCw}
          title={error}
          description="Revisa tu conexión e inténtalo de nuevo."
          action={
            <Button
              onClick={() => refetch()}
              className="h-10 bg-[#6BFF3C] px-5 font-semibold text-black hover:bg-[#5de52f]"
            >
              <RotateCw /> Reintentar
            </Button>
          }
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No encontramos productos"
          description={search ? "Prueba con otra búsqueda o cambia de categoría." : "Aún no hay productos en esta categoría."}
          action={
            <Button asChild variant="outline" className={outlineButton}>
              <Link href="/products">Ver todos los productos</Link>
            </Button>
          }
        />
      ) : (
        <>
          <ProductGrid products={products} className={cn("transition-opacity", isFetching && "opacity-60")} />

          {totalPages > 1 && (
            <nav aria-label="Paginación" className="flex items-center justify-center gap-2 sm:gap-4">
              <Button variant="outline" onClick={prevPage} disabled={page <= 1 || isFetching} className={outlineButton}>
                <ChevronLeft />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              <span className="text-sm text-zinc-400">
                Página <span className="font-semibold text-white">{page}</span> de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={page >= totalPages || isFetching}
                className={outlineButton}
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight />
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
