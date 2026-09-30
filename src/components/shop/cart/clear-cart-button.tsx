"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { useClearCart } from "@/hooks/cart";

export function ClearCartButton() {
  const clearCart = useClearCart();

  return (
    <DynamicModal
      title="¿Vaciar el carrito?"
      description="Se quitarán todos los productos del carrito."
      size="sm"
      trigger={
        <Button variant="ghost" className="text-zinc-400 hover:bg-zinc-800 hover:text-red-400">
          <Trash2 /> Vaciar carrito
        </Button>
      }
    >
      {(close) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={clearCart.isPending}
            onClick={() => clearCart.mutate(undefined, { onSuccess: close })}
          >
            {clearCart.isPending ? "Vaciando…" : "Vaciar"}
          </Button>
        </div>
      )}
    </DynamicModal>
  );
}
