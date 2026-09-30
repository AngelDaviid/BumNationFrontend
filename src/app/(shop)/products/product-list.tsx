"use client";

import { useProducts } from "@/hooks/products/use-products";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";

export default function ProductList() {
  const { isLoading, products, error } = useProducts({ initialPage: 1, limit: 8 });

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="p-8 text-center text-neutral-500">No hay productos disponibles.</p>;
  }

  return <ProductGrid products={products} className="w-full max-w-6xl px-4" />;
}
