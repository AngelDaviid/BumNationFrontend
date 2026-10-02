import { PRODUCT_GRID_CLASSES } from "./product-grid-classes";

export function ProductCardSkeleton() {
  return (
    <div aria-hidden className="w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
      <div className="aspect-square w-full animate-pulse bg-neutral-100" />

      <div className="space-y-3 p-3 sm:p-4">
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="hidden h-4 w-14 animate-pulse rounded bg-neutral-200 sm:block" />
        </div>

        <div className="h-9 w-full animate-pulse rounded-sm bg-[#65C33A]/30 sm:h-10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" className={PRODUCT_GRID_CLASSES}>
      <span className="sr-only">Cargando productos…</span>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
