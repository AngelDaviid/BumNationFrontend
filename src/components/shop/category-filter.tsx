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
    <nav
      aria-label="Categorías"
      // Se puede desplazar horizontalmente, pero sin mostrar la barra de scroll
      className="-mx-4 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-3">
        {items.map((item) => {
          const isActive = item.id === activeCategoryId;
          return (
            <li key={item.id ?? "all"}>
              <Link
                href={buildHref(item.id)}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[#65C33A] bg-[#65C33A] text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-[#65C33A] hover:text-[#65C33A]",
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
