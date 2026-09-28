import Link from "next/link";
import { Category } from "@/types";
import { cn } from "@/lib/utils/utils";

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId?: string;
  // Construye el enlace de cada categoría conservando el resto de filtros
  buildHref: (categoryId?: string) => string;
}

export function CategoryFilter({ categories, activeCategoryId, buildHref }: CategoryFilterProps) {
  const items = [{ id: undefined, name: "Todos" }, ...categories.map((c) => ({ id: String(c.id), name: c.name }))];

  return (
    <nav aria-label="Categorías" className="-mx-4 overflow-x-auto px-4 pb-1">
      <ul className="flex w-max gap-2">
        {items.map((item) => {
          const isActive = item.id === activeCategoryId;
          return (
            <li key={item.id ?? "all"}>
              <Link
                href={buildHref(item.id)}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[#6BFF3C] bg-[#6BFF3C] text-black"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white",
                )}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
