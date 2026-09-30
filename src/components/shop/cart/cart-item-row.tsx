import Image from "next/image";
import Link from "next/link";
import { ImageOff, Trash2 } from "lucide-react";
import { formattedPrice } from "@/common/formatted-price";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { cn } from "@/lib/utils/utils";
import { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
  // Versión más pequeña para el carrito lateral
  compact?: boolean;
}

export function CartItemRow({ item, onChangeQuantity, onRemove, isUpdating = false, compact = false }: CartItemRowProps) {
  const { product, quantity } = item;
  const lineTotal = String(parseFloat(product.price) * quantity);
  const exceedsStock = quantity > product.stock;
  const href = `/products/${product.id}`;

  return (
    <li className="flex gap-3 py-4 sm:gap-4">
      <Link
        href={href}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-zinc-100",
          compact ? "size-16" : "size-20 sm:size-24",
        )}
      >
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <ImageOff className="size-7" strokeWidth={1.5} aria-label="Sin imagen" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-xs">
              {product.brand}
            </p>
            <Link href={href} className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-[#65C33A] sm:text-base">
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-zinc-500">${formattedPrice(product.price)} c/u</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label={`Quitar ${product.name} del carrito`}
            className="shrink-0 text-zinc-500 hover:bg-zinc-100 hover:text-red-500"
          >
            <Trash2 />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            quantity={quantity}
            onDecrement={() => onChangeQuantity(quantity - 1)}
            onIncrement={() => onChangeQuantity(quantity + 1)}
            canDecrement={quantity > 1}
            canIncrement={quantity < product.stock}
            disabled={isUpdating}
          />
          <span className="text-base font-bold text-[#65C33A]">${formattedPrice(lineTotal)}</span>
        </div>

        {exceedsStock && (
          <p className="text-xs font-medium text-red-500">
            {product.stock <= 0
              ? "Este producto se agotó, quítalo para continuar."
              : `Solo quedan ${product.stock} unidades, ajusta la cantidad.`}
          </p>
        )}
      </div>
    </li>
  );
}
