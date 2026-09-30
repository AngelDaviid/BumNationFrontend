import { ArrowUpDown, ChevronDown, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductSort } from "@/types";

const triggerClasses =
  "h-9 gap-1.5 rounded-full border-zinc-300 bg-white px-3.5 text-zinc-700 hover:border-zinc-400 hover:bg-white hover:text-zinc-900";

interface CatalogToolbarProps {
  sort: ProductSort;
  sortOptions: { value: ProductSort; label: string }[];
  onSortChange: (value: ProductSort) => void;
  brand?: string;
  brands: string[];
  onBrandChange: (value?: string) => void;
  inStock: boolean;
  onInStockChange: (value: boolean) => void;
  canClear: boolean;
  onClear: () => void;
}

export function CatalogToolbar({
  sort,
  sortOptions,
  onSortChange,
  brand,
  brands,
  onBrandChange,
  inStock,
  onInStockChange,
  canClear,
  onClear,
}: CatalogToolbarProps) {
  const sortLabel = sortOptions.find((option) => option.value === sort)?.label ?? "Ordenar";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={triggerClasses}>
            <ArrowUpDown /> {sortLabel} <ChevronDown className="text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuRadioGroup value={sort} onValueChange={(value) => onSortChange(value as ProductSort)}>
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="cursor-pointer">
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {brands.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`${triggerClasses} ${brand ? "border-[#65C33A] text-[#3f8f1f]" : ""}`}
            >
              <Tag /> {brand ?? "Marca"} <ChevronDown className="text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
            <DropdownMenuRadioGroup value={brand ?? ""} onValueChange={(value) => onBrandChange(value || undefined)}>
              <DropdownMenuRadioItem value="" className="cursor-pointer">
                Todas las marcas
              </DropdownMenuRadioItem>
              {brands.map((name) => (
                <DropdownMenuRadioItem key={name} value={name} className="cursor-pointer">
                  {name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <label className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-3.5 text-sm font-medium text-zinc-700 hover:border-zinc-400">
        <Checkbox
          checked={inStock}
          onCheckedChange={(checked) => onInStockChange(checked === true)}
          className="data-checked:border-[#65C33A] data-checked:bg-[#65C33A] data-checked:text-white"
        />
        Solo disponibles
      </label>

      {canClear && (
        <Button variant="ghost" onClick={onClear} className="h-9 rounded-full px-3 text-zinc-500 hover:text-zinc-900">
          <X /> Limpiar
        </Button>
      )}
    </div>
  );
}
