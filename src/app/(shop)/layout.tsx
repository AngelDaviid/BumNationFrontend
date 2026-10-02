import { Suspense } from "react";
import Navbar from "@/components/navbar/nav-bar";
import { CartDrawer } from "@/components/shop/cart/cart-drawer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Suspense>
        <Navbar />
      </Suspense>
      <main className="pt-6 pb-28 md:pt-10 md:pb-0">
        {children}
      </main>
      <CartDrawer />
    </div>
  );
}