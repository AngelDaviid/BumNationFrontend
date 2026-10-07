import type { Metadata } from "next";
import { ProductsCatalog } from "./products-catalog";

export const metadata: Metadata = {
  title: "Productos | Bum Nation",
  description: "Suplementación deportiva: proteínas, creatinas, pre-entrenos y más.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  return <ProductsCatalog searchParams={await searchParams} basePath="/products" showHero />;
}
