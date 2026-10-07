"use client";

import { Button } from "@/components/ui/button";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { Loader } from "@/components/ui/loader";
import { formattedPrice } from "@/common/formatted-price";
import { useCheckout } from "@/hooks/my-orders";

interface CheckoutButtonProps {
  total: number;
  disabled?: boolean;
}

export function CheckoutButton({ total, disabled = false }: CheckoutButtonProps) {
  const checkout = useCheckout();

  return (
    <DynamicModal
      title="¿Confirmas tu pedido?"
      description={`El total es $${formattedPrice(String(total))} COP. El pedido queda pendiente hasta que el gym lo confirme.`}
      size="sm"
      trigger={
        <Button
          disabled={disabled}
          className="h-11 w-full text-sm"
        >
          Finalizar compra
        </Button>
      }
    >
      {(close) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close} disabled={checkout.isPending}>
            Revisar
          </Button>
          <Button
            onClick={() => checkout.mutate(undefined, { onSettled: close })}
            disabled={checkout.isPending}
          >
            {checkout.isPending && <Loader size="sm" tone="light" />}
            {checkout.isPending ? "Creando pedido…" : "Confirmar pedido"}
          </Button>
        </div>
      )}
    </DynamicModal>
  );
}
