import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart/cart-view";

export const metadata: Metadata = {
  title: "Carrito | Bum Nation",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-[110rem] space-y-6 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#65C33A]">Tienda</p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-4xl">Mi carrito</h1>
      </header>
      <CartView />
    </div>
  );
}
