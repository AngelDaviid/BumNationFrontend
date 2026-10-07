import {
  buildCatalogHref,
  hasActiveFilters,
  PAGE_SIZE,
  parseCatalogFilters,
  RawSearchParams,
} from "@/common/catalog";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";

interface GetCatalogPageOptions {
  searchParams: RawSearchParams;
  basePath: string;
  showHero?: boolean;
}

export async function getCatalogPage({ searchParams, basePath, showHero = false }: GetCatalogPageOptions) {
  const filters = parseCatalogFilters(searchParams);
  const { search, categoryId, brand, sort, inStock, page } = filters;

  const [categoriesResult, brandsResult, productsResult] = await Promise.allSettled([
    categoriesApi.getAll(),
    productsApi.getBrands(),
    productsApi.getAll(page, PAGE_SIZE, search, categoryId, { brand, sort, inStock }),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value : [];
  const productsPage = productsResult.status === "fulfilled" ? productsResult.value : null;

  const activeFilters = hasActiveFilters(filters);
  const activeCategory = categories.find((c) => String(c.id) === categoryId);
  const withHero = showHero && !activeFilters;

  const href = (updates: Parameters<typeof buildCatalogHref>[2]) => buildCatalogHref(basePath, searchParams, updates);

  return {
    filters,
    categories,
    brands,
    products: productsPage?.data ?? [],
    total: productsPage?.meta.total ?? 0,
    totalPages: productsPage?.meta.totalPage ?? 1,
    loadFailed: !productsPage,
    activeFilters,
    withHero,
    headingLevel: withHero ? ("h2" as const) : ("h1" as const),
    title: search ? `Resultados para "${search}"` : activeCategory?.name ?? "Todos los productos",
    buildCategoryHref: (nextCategoryId?: string) => href({ category: nextCategoryId }),
    clearSearchHref: activeCategory ? `${basePath}?category=${activeCategory.id}` : basePath,
    pageHref: (target: number) => href({ page: target > 1 ? String(target) : undefined }),
  };
}
