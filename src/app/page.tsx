import { Suspense } from "react";
import Navbar from "@/components/navbar/nav-bar";
import ProductList from "./(shop)/products/product-list";

export default function Home() {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="flex items-center justify-center  min-h-screen">
        <ProductList />
      </div>
    </>
  );
}