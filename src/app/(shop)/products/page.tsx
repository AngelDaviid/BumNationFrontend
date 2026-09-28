import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsCatalog } from "./products-catalog";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";

export const metadata: Metadata = {
  title: "Productos | Bum Nation",
  description: "Suplementación deportiva: proteínas, creatinas, pre-entrenos y más.",
};

export default function ProductsPage() {
  return (
    // useSearchParams necesita un límite de Suspense
    <Suspense
      fallback={
        <div className="-mt-20 min-h-screen bg-white pt-20">
          <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <ProductGridSkeleton />
          </div>
        </div>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
