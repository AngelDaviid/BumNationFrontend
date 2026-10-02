import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { ProductSort } from "@/types";

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

const isSort = (value: string | null): value is ProductSort =>
  SORT_OPTIONS.some((option) => option.value === value);

type FilterUpdates = Partial<Record<"category" | "brand" | "sort" | "inStock", string | undefined>>;

export function useCatalogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = usePathname();

  const search = searchParams.get("search")?.trim() || undefined;
  const categoryId = searchParams.get("category") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const sortParam = searchParams.get("sort");
  const sort: ProductSort = isSort(sortParam) ? sortParam : "newest";
  const inStock = searchParams.get("inStock") === "true";

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["products", "brands"],
    queryFn: () => productsApi.getBrands(),
  });

  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  const buildHref = (updates: FilterUpdates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const applyFilters = (updates: FilterUpdates) => router.replace(buildHref(updates), { scroll: false });

  const buildCategoryHref = (nextCategoryId?: string) => buildHref({ category: nextCategoryId });

  const clearSearchHref = activeCategory ? `${basePath}?category=${activeCategory.id}` : basePath;

  const hasActiveFilters = !!(search || categoryId || brand || inStock || sort !== "newest");

  const title = search ? `Resultados para "${search}"` : activeCategory?.name ?? "Todos los productos";

  return {
    search,
    categoryId,
    brand,
    sort,
    inStock,
    categories,
    brands,
    activeCategory,
    title,
    hasActiveFilters,
    buildCategoryHref,
    clearSearchHref,
    setSort: (value: ProductSort) => applyFilters({ sort: value === "newest" ? undefined : value }),
    setBrand: (value?: string) => applyFilters({ brand: value }),
    setInStock: (value: boolean) => applyFilters({ inStock: value ? "true" : undefined }),
    clearFilters: () => router.replace(basePath, { scroll: false }),
  };
}
