"use client";

import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/types/product.types";
import ProductCard from "@/components/shop/product-cart";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    productsApi
      .getAll()
      .then((response) => {
        if (!isMounted) return;
        setProducts(response.data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}