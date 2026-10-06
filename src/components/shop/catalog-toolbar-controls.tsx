"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildCatalogHref, SORT_OPTIONS } from "@/common/catalog";
import { CatalogToolbar } from "@/components/shop/catalog-toolbar";
import { Loader } from "@/components/ui/loader";
import { ProductSort } from "@/types";

interface CatalogToolbarControlsProps {
  sort: ProductSort;
  brand?: string;
  brands: string[];
  inStock: boolean;
  canClear: boolean;
}

export function CatalogToolbarControls({ sort, brand, brands, inStock, canClear }: CatalogToolbarControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const apply = (updates: Parameters<typeof buildCatalogHref>[2]) =>
    startTransition(() => router.replace(buildCatalogHref(pathname, searchParams, updates), { scroll: false }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CatalogToolbar
        sort={sort}
        sortOptions={SORT_OPTIONS}
        onSortChange={(value) => apply({ sort: value === "newest" ? undefined : value })}
        brand={brand}
        brands={brands}
        onBrandChange={(value) => apply({ brand: value })}
        inStock={inStock}
        onInStockChange={(value) => apply({ inStock: value ? "true" : undefined })}
        canClear={canClear}
        onClear={() => startTransition(() => router.replace(pathname, { scroll: false }))}
      />
      {isPending && <Loader tone="light" size="sm" />}
    </div>
  );
}
