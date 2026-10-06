"use client"

import {Button} from "@/components/ui/button";
import {Loader} from "@/components/ui/loader";
import {Product} from "@/types";

interface DeleteProductContentProps {
    product: Product;
    onCancel: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export function DeleteProductContent({product, onCancel, onDelete, isDeleting}: DeleteProductContentProps) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-zinc-600">
                ¿Seguro que quieres eliminar el producto <span className="font-semibold">{product.name}</span>?
                Dejará de aparecer en la tienda.
            </p>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
                    Cancelar
                </Button>
                <Button
                    type="button"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-red-500 font-semibold text-white hover:bg-red-600"
                >
                    {isDeleting && <Loader size="sm"/>}
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
            </div>
        </div>
    )
}
