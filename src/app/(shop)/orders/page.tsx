import type { Metadata } from "next";
import { MyOrdersView } from "@/components/shop/orders/my-orders-view";

export const metadata: Metadata = {
  title: "Mis pedidos | Bum Nation",
};

export default function MyOrdersPage() {
  return (
    <div className="mx-auto w-full max-w-[110rem] space-y-6 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">Tienda</p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-4xl">Mis pedidos</h1>
      </header>
      <MyOrdersView />
    </div>
  );
}
