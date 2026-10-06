import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { formattedPrice } from "@/common/formatted-price";
import { getProductBadges, ProductBadgeTone } from "@/common/product-badges";
import { cn } from "@/lib/utils/utils";
import { Product } from "@/types/product.types";
import { AddToCartButton, FavoriteButton } from "./product-card-buttons";
import { AddToCartAction, FavoriteToggle } from "./product-card-actions";

const badgeTone: Record<ProductBadgeTone, string> = {
  danger: "bg-red-600 text-white",
  warning: "bg-amber-400 text-zinc-900",
  new: "bg-zinc-900 text-neon",
};

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  isAddingToCart?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  // true: la tarjeta trae sus propios botones (islas de cliente) y puede
  // renderizarse en el servidor sin pasarle callbacks.
  selfContained?: boolean;
}

export default function ProductCard({
  product,
  isFavorite = false,
  isAddingToCart = false,
  onAddToCart,
  onToggleFavorite,
  selfContained = false,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const badges = getProductBadges(product);
  const href = `/products/${product.id}`;

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-xl">
      <div className="relative aspect-square w-full bg-neutral-100">
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
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <ImageOff className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} aria-label="Sin imagen" />
            </div>
          )}
        </Link>

        {selfContained ? (
          <FavoriteToggle product={product} />
        ) : (
          onToggleFavorite && (
            <FavoriteButton isFavorite={isFavorite} onClick={() => onToggleFavorite(product)} />
          )
        )}

        {badges.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs", badgeTone[badge.tone])}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs">
            {product.brand}
          </p>
          <Link href={href}>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 hover:text-brand-text sm:text-base">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-base font-bold text-brand-text sm:text-lg">
            ${formattedPrice(product.price)}
            <span className="ml-1 text-xs font-medium text-neutral-500 sm:text-sm">COP</span>
          </span>
          {!isOutOfStock && (
            <span className="text-xs font-medium text-neutral-500 sm:text-sm">
              Stock: <span className="font-semibold text-brand-text">{product.stock}</span>
            </span>
          )}
        </div>

        {selfContained ? (
          <AddToCartAction product={product} />
        ) : (
          onAddToCart && (
            <AddToCartButton
              isOutOfStock={isOutOfStock}
              isAdding={isAddingToCart}
              onClick={() => onAddToCart(product)}
            />
          )
        )}
      </div>
    </article>
  );
}
