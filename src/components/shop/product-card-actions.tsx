"use client";

import { useAddToCart } from "@/hooks/cart";
import { useToggleFavorite } from "@/hooks/favorites";
import { Product } from "@/types";
import { AddToCartButton, FavoriteButton } from "./product-card-buttons";


export function FavoriteToggle({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useToggleFavorite();
  return <FavoriteButton isFavorite={isFavorite(product.id)} onClick={() => toggleFavorite(product)} />;
}

export function AddToCartAction({ product }: { product: Product }) {
  const { addToCart, addingProductId } = useAddToCart();
  return (
    <AddToCartButton
      isOutOfStock={product.stock <= 0}
      isAdding={addingProductId === product.id}
      onClick={() => addToCart(product)}
    />
  );
}
