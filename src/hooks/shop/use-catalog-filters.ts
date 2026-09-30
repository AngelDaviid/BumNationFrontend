import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";

// Lee los filtros del catálogo desde la URL (?search=&category=)
export function useCatalogFilters() {
  const searchParams = useSearchParams();
  // El catálogo vive en "/" y en "/products"; los enlaces se quedan en la misma ruta
  const basePath = usePathname();
  const search = searchParams.get("search")?.trim() || undefined;
  const categoryId = searchParams.get("category") || undefined;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  // Enlace de una categoría conservando el resto de filtros
  const buildCategoryHref = (nextCategoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategoryId) params.set("category", nextCategoryId);
    else params.delete("category");
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const clearSearchHref = activeCategory ? `${basePath}?category=${activeCategory.id}` : basePath;

  const title = search ? `Resultados para "${search}"` : activeCategory?.name ?? "Todos los productos";

  return {
    search,
    categoryId,
    categories,
    activeCategory,
    title,
    buildCategoryHref,
    clearSearchHref,
  };
}
