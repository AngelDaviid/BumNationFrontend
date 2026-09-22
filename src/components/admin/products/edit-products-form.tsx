"use client"

import {UpdateProductFormValues, updateProductSchema} from "@/common/schemas/product.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateProducts} from "@/hooks/products/use-update-products";
import {FormCard} from "@/components/ui/form-card";
import {FormTitle} from "@/components/ui/form-title";
import {FormGrid} from "@/components/ui/from-grid";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";


interface EditProductFormProps {
    productId: number;
    defaultValues: UpdateProductFormValues;
    onSuccess?: () => void;
}

export function EditProductsForm({productId, defaultValues, onSuccess}: EditProductFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors, isDirty}
    } = useForm<UpdateProductFormValues>({
        resolver: zodResolver(updateProductSchema),
        defaultValues,
    })

    const {mutate: updateProduct, isPending, isError, error} = useUpdateProducts()

    const onSubmit = (data: UpdateProductFormValues) => {
        updateProduct(
            {id: productId, data}, {
                onSuccess: () => {
                    onSuccess?.();
                }
            });
    };

    return (
        <FormCard
            onSubmit={handleSubmit(onSubmit)}
            error={isError ? (error as Error).message : undefined}
            header={<FormTitle title={"Actualizar producto"}/>}
            maxWidth={"2xl"}
        >
            <FormGrid columns={2}>
                <Field label={"Nombre"}>
                    <Input
                        type="text"
                        error={errors.name?.message}
                        registration={register("name")}
                    />
                </Field>
                <Field label={"Descripción"}>
                    <Input
                        type="text"
                        error={errors.description?.message}
                        registration={register("description")}
                    />
                </Field>
                <Field label={"Precio"}>
                    <Input
                        type="number"
                        error={errors.price?.message}
                        registration={register("price")}
                    />
                </Field>
                <Field label={"Stock"}>
                    <Input
                        type="number"
                        error={errors.stock?.message}
                        registration={register("stock")}
                    />
                </Field>
                <Field label={"Marca"}>
                    <Input
                        type="text"
                        error={errors.brand?.message}
                        registration={register("brand")}
                    />
                </Field>
                {/** Cambiar por un selector que consulte las categorias **/}
                <Field label={"Categoria"}>
                    <Input
                        type="number"
                        error={errors.categoryId?.message}
                        registration={register("categoryId")}
                    />
                </Field>
            </FormGrid>

            <div className="flex justify-end mt-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !isDirty}
                    className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors"
                >
                    {isPending && <Loader2 size={16} className="animate-spin"/>}
                    {isPending ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </div>
        </FormCard>
    )
}