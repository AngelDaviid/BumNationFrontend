"use client";

import { Product } from "@/types/product.types";
import ProductCard from "@/components/shop/product-cart";
import {useProducts} from "@/hooks/products/use-products";

export default function ProductList() {

  const { isLoading, products, error} = useProducts({initialPage: 1, limit: 10 });


  const handleAddToCart = (product: Product) => {
    console.log("Agregado al carrito:", product);
  };

  const handleToggleFavorite = (product: Product, isFavorite: boolean) => {
    console.log(product.name, "favorito:", isFavorite);
  };

  if (isLoading) {
    return <p className="p-8 text-center text-neutral-500">Cargando productos…</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="p-8 text-center text-neutral-500">No hay productos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((products) => (
        <ProductCard
          key={products.id}
          product={products}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}