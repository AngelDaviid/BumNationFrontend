import { Suspense } from "react";
import Navbar from "@/components/navbar/nav-bar";

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
      <main className="pb-28 md:pb-0">
        {children}
      </main>
    </div>
  );
}