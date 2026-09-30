"use client";

import { useAddToCart } from "@/hooks/cart";
import { useToggleFavorite } from "@/hooks/favorites";
import { cn } from "@/lib/utils/utils";
import { Product } from "@/types";
import ProductCard from "./product-cart";
import { PRODUCT_GRID_CLASSES } from "./product-grid-classes";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  const { addToCart, addingProductId } = useAddToCart();
  const { isFavorite, toggleFavorite } = useToggleFavorite();

  return (
    <div className={cn(PRODUCT_GRID_CLASSES, className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={isFavorite(product.id)}
          isAddingToCart={addingProductId === product.id}
          onAddToCart={(p) => addToCart(p)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
