"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Heart, ImageOff, PackageX, ShoppingCart } from "lucide-react";
import { formattedPrice } from "@/common/formatted-price";
import { useProduct } from "@/hooks/products/use-product";
import { useRelatedProducts } from "@/hooks/products/use-related-products";
import { useAddToCart } from "@/hooks/cart";
import { useToggleFavorite } from "@/hooks/favorites";
import { useQuantitySelector } from "@/hooks/shop/use-quantity-selector";
import { EmptyState } from "@/components/shop/empty-state";
import { ProductGrid } from "@/components/shop/product-grid";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/utils";

export function ProductDetail({ productId }: { productId: number }) {
  const { product, isLoading, isError } = useProduct({ id: productId });
  const { addToCart, isAdding } = useAddToCart();
  const { isFavorite, toggleFavorite } = useToggleFavorite();
  const quantity = useQuantitySelector(product?.stock ?? 1);
  const related = useRelatedProducts(product);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader tone="light" label="Cargando producto…" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={PackageX}
        title="No encontramos este producto"
        description="Puede que ya no esté disponible."
        action={
          <Button asChild className="h-10 bg-[#65C33A] px-5 font-semibold text-white hover:bg-[#58ad32]">
            <Link href="/">Volver a la tienda</Link>
          </Button>
        }
      />
    );
  }

  const isOutOfStock = product.stock <= 0;
  const favorite = isFavorite(product.id);

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-[#65C33A]"
      >
        <ChevronLeft size={16} /> Volver a la tienda
      </Link>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <ImageOff className="size-16" strokeWidth={1.5} aria-label="Sin imagen" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#65C33A]">
              {product.category?.name ?? "Producto"}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-zinc-500">{product.brand}</p>
          </div>

          <p className="text-3xl font-bold text-[#65C33A]">
            ${formattedPrice(product.price)}
            <span className="ml-1.5 text-base font-medium text-zinc-500">COP</span>
          </p>

          <p className={cn("text-sm font-medium", isOutOfStock ? "text-red-500" : "text-zinc-700")}>
            {isOutOfStock ? "Agotado" : `${product.stock} unidades disponibles`}
          </p>

          {product.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 sm:text-base">
              {product.description}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {!isOutOfStock && (
              <QuantityStepper
                quantity={quantity.quantity}
                onIncrement={quantity.increment}
                onDecrement={quantity.decrement}
                canIncrement={quantity.canIncrement}
                canDecrement={quantity.canDecrement}
                disabled={isAdding}
              />
            )}

            <div className="flex flex-1 gap-3">
              <Button
                onClick={() => addToCart(product, quantity.quantity)}
                disabled={isOutOfStock || isAdding}
                className="h-11 flex-1 bg-[#65C33A] text-sm font-semibold text-white hover:bg-[#58ad32] disabled:bg-zinc-200 disabled:text-zinc-500 disabled:opacity-100"
              >
                {isAdding ? <Loader tone="light" size="sm" /> : <ShoppingCart />}
                {isOutOfStock ? "Sin stock" : isAdding ? "Agregando…" : "Agregar al carrito"}
              </Button>

              <Button
                variant="outline"
                size="icon-lg"
                onClick={() => toggleFavorite(product)}
                aria-pressed={favorite}
                aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                className="size-11 border-zinc-300 bg-transparent hover:border-[#65C33A] hover:bg-transparent"
              >
                <Heart
                  className={cn("size-5", favorite ? "fill-[#65C33A] text-[#65C33A]" : "text-zinc-700")}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {related.products.length > 0 && (
        <section className="space-y-4 pt-4 sm:pt-8">
          <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">También te puede interesar</h2>
          <ProductGrid products={related.products} />
        </section>
      )}
    </div>
  );
}
