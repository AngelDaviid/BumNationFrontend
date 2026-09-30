"use client";

import { Button } from "@/components/ui/button";
import { DynamicModal } from "@/components/ui/dynamic-modal";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCancelMyOrder } from "@/hooks/my-orders";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const { register, cancelOrder, isCancelling } = useCancelMyOrder(orderId);

  return (
    <DynamicModal
      title="¿Cancelar este pedido?"
      description="Los productos vuelven al inventario y no se puede deshacer."
      size="sm"
      trigger={
        <Button variant="destructive" className="h-10 px-4">
          Cancelar pedido
        </Button>
      }
    >
      {(close) => (
        <form onSubmit={cancelOrder(close)} className="space-y-4">
          <Field label="Motivo (opcional)">
            <Input placeholder="Ej.: me equivoqué de producto" registration={register("reason")} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close} disabled={isCancelling}>
              Volver
            </Button>
            <Button type="submit" variant="destructive" disabled={isCancelling}>
              {isCancelling ? "Cancelando…" : "Cancelar pedido"}
            </Button>
          </div>
        </form>
      )}
    </DynamicModal>
  );
}
