import Link from "next/link";
import { PackageSearch, RotateCw } from "lucide-react";
import { RawSearchParams } from "@/common/catalog";
import { getCatalogPage } from "@/lib/catalog/get-catalog-page";
import ProductCard from "@/components/shop/product-cart";
import { PRODUCT_GRID_CLASSES } from "@/components/shop/product-grid-classes";
import { CategoryFilter } from "@/components/shop/category-filter";
import { CatalogToolbarControls } from "@/components/shop/catalog-toolbar-controls";
import { CatalogPagination, outlineButton } from "@/components/shop/catalog-pagination";
import { ShopHero } from "@/components/shop/shop-hero";
import { BrandSection } from "@/components/shop/brand-divider";
import { EmptyState } from "@/components/shop/empty-state";
import { RetryButton } from "@/components/shop/retry-button";
import { Button } from "@/components/ui/button";

interface ProductsCatalogProps {
  searchParams: RawSearchParams;
  basePath: string;
  showHero?: boolean;
}

export async function ProductsCatalog({ searchParams, basePath, showHero = false }: ProductsCatalogProps) {
  const {
    filters,
    categories,
    brands,
    products,
    total,
    totalPages,
    loadFailed,
    activeFilters,
    withHero,
    headingLevel: Heading,
    title,
    buildCategoryHref,
    clearSearchHref,
    pageHref,
  } = await getCatalogPage({ searchParams, basePath, showHero });

  return (
    <>
      {withHero && <ShopHero categories={categories} buildCategoryHref={buildCategoryHref} />}

      <div className="mx-auto w-full max-w-[110rem] space-y-6 px-4 sm:px-6 lg:px-10 py-6 sm:space-y-8 sm:py-8">
        <header id="catalogo" className="scroll-mt-24 space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">Tienda</p>
              <Heading className="mt-1 break-words text-2xl font-bold text-zinc-900 sm:text-4xl">{title}</Heading>
            </div>

            {!loadFailed && (
              <div className="flex h-6 items-center text-sm text-zinc-500">
                {total} {total === 1 ? "producto" : "productos"}
              </div>
            )}
          </div>

          {filters.search && (
            <Link
              href={clearSearchHref}
              className="inline-block text-sm text-zinc-500 underline-offset-4 hover:text-brand-text hover:underline"
            >
              Quitar búsqueda
            </Link>
          )}

          <CategoryFilter categories={categories} activeCategoryId={filters.categoryId} buildHref={buildCategoryHref} />

          <CatalogToolbarControls
            sort={filters.sort}
            brand={filters.brand}
            brands={brands}
            inStock={filters.inStock}
            canClear={activeFilters}
          />
        </header>

        <BrandSection className="space-y-6">
          {loadFailed ? (
            <EmptyState
              icon={RotateCw}
              title="No se pudieron cargar los productos."
              description="Revisa tu conexión e inténtalo de nuevo."
              action={<RetryButton />}
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No encontramos productos"
              description={activeFilters ? "Prueba con otra búsqueda o quita algunos filtros." : "Aún no hay productos."}
              action={
                activeFilters && (
                  <Button asChild variant="outline" className={outlineButton}>
                    <Link href={basePath} scroll={false}>
                      Quitar filtros
                    </Link>
                  </Button>
                )
              }
            />
          ) : (
            <>
              <div className={PRODUCT_GRID_CLASSES}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} selfContained />
                ))}
              </div>

              <CatalogPagination page={filters.page} totalPages={totalPages} pageHref={pageHref} />
            </>
          )}
        </BrandSection>
      </div>
    </>
  );
}
