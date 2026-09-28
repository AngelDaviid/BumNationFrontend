"use client"

import {EditProductsForm} from "@/components/admin/products/edit-products-form";
import {useParams} from "next/navigation";
import {useProduct} from "@/hooks/products/use-product";

export default function EditProduct() {
    const params = useParams<{id: string}>();
    const { product, isLoading, error } = useProduct({id: Number(params.id)});

    if (isLoading) {
        return <p className="p-6 text-zinc-500">Cargando producto...</p>;
    }

    if (error || !product) {
        return <p className="p-6 text-red-500">No se pudo cargar el producto.</p>;
    }


    return (
        <div className="flex min-h-screen bg-zinc-50">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 space-y-6">
                    <EditProductsForm
                        productId={product.id}
                        defaultValues={{
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            stock: product.stock,
                            brand: product.brand,
                            categoryId: product.categoryId,
                        }}
                    />
                </main>
            </div>
        </div>
    )
}