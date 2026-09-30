import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsCatalog } from "./products/products-catalog";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";

export const metadata: Metadata = {
  title: "Bum Nation | Suplementación deportiva",
  description: "Suplementación deportiva: proteínas, creatinas, pre-entrenos y más.",
};

// La tienda es la página principal
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <ProductGridSkeleton />
        </div>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
