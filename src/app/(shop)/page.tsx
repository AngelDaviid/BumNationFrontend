import type { Metadata } from "next";
import { ProductsCatalog } from "./products/products-catalog";

export const metadata: Metadata = {
  title: "Bum Nation | Suplementación deportiva",
  description: "Suplementación deportiva: proteínas, creatinas, pre-entrenos y más.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  return <ProductsCatalog searchParams={await searchParams} basePath="/" showHero />;
}
