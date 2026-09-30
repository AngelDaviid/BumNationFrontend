import Link from "next/link";
import { formattedPrice } from "@/common/formatted-price";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  hasStockIssues: boolean;
}

export function CartSummary({ itemCount, subtotal, hasStockIssues }: CartSummaryProps) {
  return (
    <aside className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 lg:sticky lg:top-28">
      <h2 className="text-lg font-bold text-white">Resumen</h2>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-zinc-400">
          <dt>Productos</dt>
          <dd>{itemCount}</dd>
        </div>
        <div className="flex justify-between text-zinc-400">
          <dt>Envío</dt>
          <dd>Por confirmar</dd>
        </div>
      </dl>

      <Separator className="bg-zinc-800" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-zinc-300">Total</span>
        <span className="text-2xl font-bold text-[#6BFF3C]">
          ${formattedPrice(String(subtotal))}
          <span className="ml-1 text-sm font-medium text-zinc-500">COP</span>
        </span>
      </div>

      {hasStockIssues && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
          Algunos productos superan el stock disponible. Ajusta las cantidades.
        </p>
      )}

      <Button
        asChild
        variant="outline"
        className="h-10 w-full border-zinc-700 bg-transparent text-zinc-300 hover:border-[#6BFF3C] hover:bg-transparent hover:text-[#6BFF3C]"
      >
        <Link href="/products">Seguir comprando</Link>
      </Button>
    </aside>
  );
}
