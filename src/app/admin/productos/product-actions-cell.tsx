"use client";

import {Pencil, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DynamicModal} from "@/components/ui/dynamic-modal";
import {EditProductsForm} from "@/components/admin/products/edit-products-form";
import {DeleteProductContent} from "@/components/admin/products/delete-product-content";
import {useDeleteProduct} from "@/hooks/products/use-delete-product";
import {toProductFormValues} from "@/hooks/products/use-edit-product-form";
import {Product} from "@/types";

export function ProductActionsCell({product}: { product: Product }) {
    const {mutate: deleteProduct, isPending: isDeleting} = useDeleteProduct();

    return (
        <div className="flex justify-center gap-1">
            <DynamicModal
                title=""
                size="full"
                trigger={
                    <Button size="icon" variant="ghost" aria-label="Editar">
                        <Pencil/>
                    </Button>
                }
            >
                {(close) => (
                    <EditProductsForm
                        productId={product.id}
                        imageUrl={product.imageUrl}
                        defaultValues={toProductFormValues(product)}
                        onSuccess={close}
                    />
                )}
            </DynamicModal>

            <DynamicModal
                title="Eliminar producto"
                description={product.name}
                size="sm"
                closeOnOutsideClick={true}
                trigger={
                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" aria-label="Eliminar">
                        <Trash2/>
                    </Button>
                }
            >
                {(close) => (
                    <DeleteProductContent
                        product={product}
                        onCancel={close}
                        onDelete={() => deleteProduct(product.id, {onSuccess: close})}
                        isDeleting={isDeleting}
                    />
                )}
            </DynamicModal>
        </div>
    );
}
