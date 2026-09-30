import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart/cart-view";

export const metadata: Metadata = {
  title: "Carrito | Bum Nation",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:py-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6BFF3C]">Tienda</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-4xl">Mi carrito</h1>
      </header>
      <CartView />
    </div>
  );
}
