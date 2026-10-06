"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formattedPrice } from "@/common/formatted-price";
import { useCart, useCartItemActions } from "@/hooks/cart";
import { useCartDrawerStore } from "@/stores/cart-drawer.store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartItemRow } from "./cart-item-row";

export function CartDrawer() {
  const { isOpen, setOpen } = useCartDrawerStore();
  const { items, itemCount, subtotal } = useCart();
  const actions = useCartItemActions();
  const close = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 bg-white sm:max-w-md">
        <SheetHeader className="border-b border-zinc-200 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <ShoppingCart className="size-5 text-brand-text" /> Tu carrito
          </SheetTitle>
          <SheetDescription>
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <ShoppingCart className="size-10 text-zinc-300" strokeWidth={1.5} />
            <p className="font-semibold text-zinc-900">Tu carrito está vacío</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-zinc-200 overflow-y-auto px-5">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                compact
                isUpdating={actions.isUpdating(item)}
                onChangeQuantity={(quantity) => actions.changeQuantity(item, quantity)}
                onRemove={() => actions.remove(item)}
              />
            ))}
          </ul>
        )}

        <SheetFooter className="gap-3 border-t border-zinc-200 px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-zinc-700">Total</span>
            <span className="text-xl font-bold text-brand-text">
              ${formattedPrice(String(subtotal))}
              <span className="ml-1 text-xs font-medium text-zinc-500">COP</span>
            </span>
          </div>
          <Button
            asChild
            className="h-11 text-sm"
            onClick={close}
          >
            <Link href="/cart">Ver carrito y pagar</Link>
          </Button>
          <Button variant="outline" onClick={close} className="h-10 border-zinc-300 text-zinc-700">
            Seguir comprando
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
