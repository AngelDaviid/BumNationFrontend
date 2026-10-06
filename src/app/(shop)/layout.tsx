import { Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Navbar from "@/components/navbar/nav-bar";
import { CartDrawer } from "@/components/shop/cart/cart-drawer";
import { categoriesApi } from "@/lib/api/categories";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["categories"], queryFn: () => categoriesApi.getAll() });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-zinc-50">
        <Suspense fallback={<div className="h-20" />}>
          <Navbar />
        </Suspense>
        <main className="pt-6 pb-28 md:pt-10 md:pb-0">
          {children}
        </main>
        <CartDrawer />
      </div>
    </HydrationBoundary>
  );
}
