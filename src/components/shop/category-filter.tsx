import Link from "next/link";
import { Category } from "@/types";
import { cn } from "@/lib/utils/utils";

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId?: string;
  buildHref: (categoryId?: string) => string;
}

export function CategoryFilter({ categories, activeCategoryId, buildHref }: CategoryFilterProps) {
  const items = [{ id: undefined, name: "Todos" }, ...categories.map((c) => ({ id: String(c.id), name: c.name }))];

  return (
    <nav
      aria-label="Categorías"
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
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
                    ? "border-[#65C33A] bg-[#65C33A] text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:text-zinc-900",
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
