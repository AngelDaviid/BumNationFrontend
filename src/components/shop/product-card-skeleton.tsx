// Mismas dimensiones que ProductCard para que no haya saltos al cargar
export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden
      className="w-70 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
    >
      <div className="aspect-square w-full animate-pulse bg-neutral-800" />

      <div className="space-y-3 p-4">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-6 w-28 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
        </div>

        <div className="h-10 w-full animate-pulse rounded-sm bg-[#65C33A]/30" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <span className="sr-only">Cargando productos…</span>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
