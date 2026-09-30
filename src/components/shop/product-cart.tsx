import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import { formattedPrice } from "@/common/formatted-price";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/utils";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  isAddingToCart?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

export default function ProductCard({
  product,
  isFavorite = false,
  isAddingToCart = false,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const href = `/products/${product.id}`;

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-xl">
      <div className="relative aspect-square w-full bg-neutral-900">
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-600">
              <ImageOff className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} aria-label="Sin imagen" />
            </div>
          )}
        </Link>

        {onToggleFavorite && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(product)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="absolute top-2 right-2 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60"
          >
            <Heart
              className={cn("size-5 transition-colors", isFavorite ? "fill-[#65C33A] text-[#65C33A]" : "text-white")}
              strokeWidth={2}
            />
          </Button>
        )}

        {isOutOfStock && (
          <span className="absolute bottom-2 left-2 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-neutral-400 sm:text-xs">
            {product.brand}
          </p>
          <Link href={href}>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 hover:text-[#3f8f1f] sm:text-base">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-base font-bold text-[#65C33A] sm:text-lg">
            ${formattedPrice(product.price)}
            <span className="ml-1 text-xs font-medium text-neutral-500 sm:text-sm">COP</span>
          </span>
          {!isOutOfStock && (
            <span className="text-xs font-medium text-neutral-500 sm:text-sm">
              Stock: <span className="font-semibold text-[#65C33A]">{product.stock}</span>
            </span>
          )}
        </div>

        {onAddToCart && (
          <Button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock || isAddingToCart}
            className="h-9 w-full rounded-sm bg-[#65C33A] text-xs font-semibold text-white hover:bg-[#58ad32] disabled:bg-neutral-300 disabled:opacity-100 sm:h-10 sm:text-sm"
          >
            {isAddingToCart ? (
              <Loader size="sm" />
            ) : (
              <ShoppingCart className="size-4 sm:size-5" strokeWidth={2} />
            )}
            {isOutOfStock ? "Sin stock" : isAddingToCart ? "Agregando…" : "Agregar"}
          </Button>
        )}
      </div>
    </article>
  );
}
