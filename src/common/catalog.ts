import { ProductSort } from "@/types";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

export type RawSearchParams = Record<string, string | string[] | undefined>;

export interface CatalogFilters {
  search?: string;
  categoryId?: string;
  brand?: string;
  sort: ProductSort;
  inStock: boolean;
  page: number;
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export function parseCatalogFilters(params: RawSearchParams): CatalogFilters {
  const sortParam = first(params.sort);
  const page = Number.parseInt(first(params.page) ?? "1", 10);
  return {
    search: first(params.search)?.trim() || undefined,
    categoryId: first(params.category) || undefined,
    brand: first(params.brand) || undefined,
    sort: SORT_OPTIONS.some((option) => option.value === sortParam) ? (sortParam as ProductSort) : "newest",
    inStock: first(params.inStock) === "true",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

export const hasActiveFilters = (filters: CatalogFilters) =>
  !!(filters.search || filters.categoryId || filters.brand || filters.inStock || filters.sort !== "newest");

type HrefUpdates = Partial<Record<"category" | "brand" | "sort" | "inStock" | "page" | "search", string | undefined>>;

export function buildCatalogHref(basePath: string, current: URLSearchParams | RawSearchParams, updates: HrefUpdates) {
  const params =
    current instanceof URLSearchParams ? new URLSearchParams(current.toString()) : new URLSearchParams();
  if (!(current instanceof URLSearchParams)) {
    for (const [key, value] of Object.entries(current)) {
      const v = first(value);
      if (v) params.set(key, v);
    }
  }
  if (!("page" in updates)) params.delete("page");
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
