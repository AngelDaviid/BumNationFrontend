import Navbar from "@/components/navbar/nav-bar";
import ProductList from "./(shop)/products/product-list";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center  min-h-screen">
        <ProductList />
      </div>
    </>
  );
}