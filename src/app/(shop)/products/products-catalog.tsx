"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch, RotateCw } from "lucide-react";
import { useProducts } from "@/hooks/products/use-products";
import { SORT_OPTIONS, useCatalogFilters } from "@/hooks/shop/use-catalog-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { CategoryFilter } from "@/components/shop/category-filter";
import { CatalogToolbar } from "@/components/shop/catalog-toolbar";
import { ShopHero } from "@/components/shop/shop-hero";
import { BrandSection } from "@/components/shop/brand-divider";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/utils";

const PAGE_SIZE = 12;

const outlineButton =
  "h-10 border-zinc-300 bg-transparent px-4 text-zinc-700 hover:border-[#65C33A] hover:bg-transparent hover:text-[#65C33A]";

export function ProductsCatalog({ showHero = false }: { showHero?: boolean }) {
  const filters = useCatalogFilters();
  const { search, categoryId, brand, sort, inStock, categories, title, buildCategoryHref, clearSearchHref } = filters;

  const { products, total, page, totalPages, isLoading, isFetching, error, refetch, nextPage, prevPage } =
    useProducts({ search, categoryId, brand, sort, inStock, limit: PAGE_SIZE });

  const withHero = showHero && !filters.hasActiveFilters;
  const Heading = withHero ? "h2" : "h1";

  return (
    <div className="mx-auto w-full max-w-[110rem] space-y-6 px-4 sm:px-6 lg:px-10 py-6 sm:space-y-8 sm:py-8">
      {withHero && (
        <ShopHero categories={categories} buildCategoryHref={buildCategoryHref} />
      )}

      <header id="catalogo" className="scroll-mt-32 space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#65C33A]">Tienda</p>
            <Heading className="mt-1 break-words text-2xl font-bold text-zinc-900 sm:text-4xl">{title}</Heading>
          </div>

          <div className="flex h-6 items-center gap-3 text-sm text-zinc-500">
            {isFetching && !isLoading && <Loader tone="light" size="sm" />}
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
            className="inline-block text-sm text-zinc-500 underline-offset-4 hover:text-[#65C33A] hover:underline"
          >
            Quitar búsqueda
          </Link>
        )}

        <CategoryFilter categories={categories} activeCategoryId={categoryId} buildHref={buildCategoryHref} />

        <CatalogToolbar
          sort={sort}
          sortOptions={SORT_OPTIONS}
          onSortChange={filters.setSort}
          brand={brand}
          brands={filters.brands}
          onBrandChange={filters.setBrand}
          inStock={inStock}
          onInStockChange={filters.setInStock}
          canClear={filters.hasActiveFilters}
          onClear={filters.clearFilters}
        />
      </header>

      <BrandSection className="space-y-6">
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
                className="h-10 bg-[#65C33A] px-5 font-semibold text-white hover:bg-[#58ad32]"
              >
                <RotateCw /> Reintentar
              </Button>
            }
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No encontramos productos"
            description={
              filters.hasActiveFilters ? "Prueba con otra búsqueda o quita algunos filtros." : "Aún no hay productos."
            }
            action={
              filters.hasActiveFilters && (
                <Button variant="outline" onClick={filters.clearFilters} className={outlineButton}>
                  Quitar filtros
                </Button>
              )
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
                <span className="text-sm text-zinc-500">
                  Página <span className="font-semibold text-zinc-900">{page}</span> de {totalPages}
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
      </BrandSection>
    </div>
  );
}
