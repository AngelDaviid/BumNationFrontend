"use client";

import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DynamicModal} from "@/components/ui/dynamic-modal";
import {CreateProductForm} from "@/components/admin/products/create-product-form";

export function CreateProductButton() {
    return (
        <DynamicModal
            title=""
            size="full"
            trigger={
                <Button size="sm" className="bg-[#6BFF3C] font-semibold text-black hover:bg-[#5de52f]">
                    <Plus/> Agregar producto
                </Button>
            }
        >
            {(close) => <CreateProductForm onSuccess={close}/>}
        </DynamicModal>
    );
}
