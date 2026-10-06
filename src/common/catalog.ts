import { buildQueryHref, firstParam, RawSearchParams } from "@/common/url-params";
import { ProductSort } from "@/types";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

export type { RawSearchParams };

export interface CatalogFilters {
  search?: string;
  categoryId?: string;
  brand?: string;
  sort: ProductSort;
  inStock: boolean;
  page: number;
}


export function parseCatalogFilters(params: RawSearchParams): CatalogFilters {
  const sortParam = firstParam(params.sort);
  const page = Number.parseInt(firstParam(params.page) ?? "1", 10);
  return {
    search: firstParam(params.search)?.trim() || undefined,
    categoryId: firstParam(params.category) || undefined,
    brand: firstParam(params.brand) || undefined,
    sort: SORT_OPTIONS.some((option) => option.value === sortParam) ? (sortParam as ProductSort) : "newest",
    inStock: firstParam(params.inStock) === "true",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

export const hasActiveFilters = (filters: CatalogFilters) =>
  !!(filters.search || filters.categoryId || filters.brand || filters.inStock || filters.sort !== "newest");

type HrefUpdates = Partial<Record<"category" | "brand" | "sort" | "inStock" | "page" | "search", string | undefined>>;

export function buildCatalogHref(basePath: string, current: URLSearchParams | RawSearchParams, updates: HrefUpdates) {
  return buildQueryHref(basePath, current, updates);
}
