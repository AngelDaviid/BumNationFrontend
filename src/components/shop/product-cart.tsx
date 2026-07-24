"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { formattedPrice } from "@/common/formatted-price";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product, isFavorite: boolean) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    onToggleFavorite?.(product, next);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="w-70 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:shadow-xl cursor-pointer">
      <div className="relative aspect-square w-full bg-neutral-900">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {product.brand}
          </p>
          <h3 className="text-base font-bold leading-snug text-neutral-900">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#65C33A]">
            ${formattedPrice(product.price)}
            <span className="ml-1 text-sm font-medium text-neutral-500">
              COP
            </span>
          </span>
          <span
            className={`text-sm font-medium text-[#65C33A]${
              isOutOfStock ? "text-red-500" : "text-neutral-500"
            }`}
          >
            Stock:{" "}
            <span className="font-semibold text-[#65C33A]">
              {isOutOfStock ? "Agotado" : product.stock}
            </span>
          </span>
        </div>

        <div className="flex pt-1">
        {/*<button
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 active:scale-95"
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
              strokeWidth={2}
              color={isFavorite ? "#ef4444" : "currentColor"}
            />
            Favoritos
          </button> */}
        
         <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock}
            className="flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-sm bg-[#65C33A] px-4 py-2.5 text-sm font-semibold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}