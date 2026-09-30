"use client";

import Link from "next/link";
import { RotateCw, ShoppingCart } from "lucide-react";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/cart";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";
import { ClearCartButton } from "./clear-cart-button";

export function CartView() {
  const { items, itemCount, subtotal, hasStockIssues, isLoading, isError, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader label="Cargando tu carrito…" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={RotateCw}
        title="No pudimos cargar tu carrito"
        description="Revisa tu conexión e inténtalo de nuevo."
        action={
          <Button onClick={() => refetch()} className="h-10 bg-[#6BFF3C] px-5 font-semibold text-black hover:bg-[#5de52f]">
            <RotateCw /> Reintentar
          </Button>
        }
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Tu carrito está vacío"
        description="Agrega productos desde la tienda y aparecerán aquí."
        action={
          <Button asChild className="h-10 bg-[#6BFF3C] px-5 font-semibold text-black hover:bg-[#5de52f]">
            <Link href="/products">Ir a la tienda</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 sm:px-5">
        <div className="flex items-center justify-between border-b border-zinc-800 py-3">
          <h2 className="text-sm font-semibold text-zinc-300">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </h2>
          <ClearCartButton />
        </div>

        <ul className="divide-y divide-zinc-800">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isUpdating={updateItem.isPending && updateItem.variables?.itemId === item.id}
              onChangeQuantity={(quantity) => updateItem.mutate({ itemId: item.id, quantity })}
              onRemove={() => removeItem.mutate(item)}
            />
          ))}
        </ul>
      </section>

      <CartSummary itemCount={itemCount} subtotal={subtotal} hasStockIssues={hasStockIssues} />
    </div>
  );
}
