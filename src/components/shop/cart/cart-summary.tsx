import Link from "next/link";
import { formattedPrice } from "@/common/formatted-price";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckoutButton } from "./checkout-button";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  hasStockIssues: boolean;
}

export function CartSummary({ itemCount, subtotal, hasStockIssues }: CartSummaryProps) {
  return (
    <aside className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 lg:sticky lg:top-28">
      <h2 className="text-lg font-bold text-zinc-900">Resumen</h2>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-zinc-500">
          <dt>Productos</dt>
          <dd>{itemCount}</dd>
        </div>
        <div className="flex justify-between text-zinc-500">
          <dt>Envío</dt>
          <dd>Por confirmar</dd>
        </div>
      </dl>

      <Separator className="bg-zinc-100" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-zinc-700">Total</span>
        <span className="text-2xl font-bold text-brand-text">
          ${formattedPrice(String(subtotal))}
          <span className="ml-1 text-sm font-medium text-zinc-500">COP</span>
        </span>
      </div>

      {hasStockIssues && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          Algunos productos superan el stock disponible. Ajusta las cantidades.
        </p>
      )}

      <CheckoutButton total={subtotal} disabled={hasStockIssues || itemCount === 0} />

      <Button
        asChild
        variant="outline"
        className="h-10 w-full border-zinc-300 bg-transparent text-zinc-700 hover:border-brand hover:bg-transparent hover:text-brand-text"
      >
        <Link href="/">Seguir comprando</Link>
      </Button>
    </aside>
  );
}
