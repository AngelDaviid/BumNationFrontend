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
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[110rem] px-4 sm:px-6 lg:px-10 py-8">
          <ProductGridSkeleton />
        </div>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
