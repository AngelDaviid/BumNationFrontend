"use client";

import Link from "next/link";
import { Heart, RotateCw } from "lucide-react";
import { useFavorites } from "@/hooks/favorites";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";

export function FavoritesView() {
  const { products, isLoading, isError, refetch } = useFavorites();

  if (isLoading) return <ProductGridSkeleton count={4} />;

  if (isError) {
    return (
      <EmptyState
        icon={RotateCw}
        title="No pudimos cargar tus favoritos"
        description="Revisa tu conexión e inténtalo de nuevo."
        action={
          <Button onClick={() => refetch()} className="h-10 px-5">
            <RotateCw /> Reintentar
          </Button>
        }
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Aún no tienes favoritos"
        description="Toca el corazón de un producto para guardarlo aquí."
        action={
          <Button asChild className="h-10 px-5">
            <Link href="/">Explorar productos</Link>
          </Button>
        }
      />
    );
  }

  return <ProductGrid products={products} />;
}
