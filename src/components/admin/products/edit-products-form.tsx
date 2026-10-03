"use client"

import {UpdateProductFormValues, updateProductSchema} from "@/common/schemas/product.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateProducts} from "@/hooks/products/use-update-products";
import {FormCard} from "@/components/ui/form-card";
import {FormTitle} from "@/components/ui/form-title";
import {FormGrid} from "@/components/ui/from-grid";
import {Field} from "@/components/ui/field";
import {FieldError} from "@/components/ui/field-error";
import {Input} from "@/components/ui/input";
import {CurrencyInput} from "@/components/ui/currency-input";
import {Button} from "@/components/ui/button";
import {Loader} from "@/components/ui/loader";
import {StatusSelect} from "@/components/admin/selecteables/status-select";
import {useCategories} from "@/hooks/categories/use-categories";
import {Controller, useForm} from "react-hook-form";


interface EditProductFormProps {
    productId: number;
    defaultValues: UpdateProductFormValues;
    onSuccess?: () => void;
}

export function EditProductsForm({productId, defaultValues, onSuccess}: EditProductFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {errors, isDirty}
    } = useForm<UpdateProductFormValues>({
        resolver: zodResolver(updateProductSchema),
        defaultValues,
    })

    const {mutate: updateProduct, isPending} = useUpdateProducts()
    const {categories, isLoading: isLoadingCategories} = useCategories()

    const categoryOptions = categories.map((category) => ({
        value: String(category.id),
        label: category.name,
    }))

    const onSubmit = (data: UpdateProductFormValues) => {
        updateProduct(
            {id: productId, data}, {
                onSuccess: (updatedProduct) => {
                    reset({
                        name: updatedProduct.name,
                        description: updatedProduct.description,
                        price: String(updatedProduct.price),
                        stock: updatedProduct.stock,
                        brand: updatedProduct.brand,
                        categoryId: updatedProduct.categoryId,
                    });
                    onSuccess?.();
                }
            });
    };

    return (
        <FormCard
            onSubmit={handleSubmit(onSubmit)}
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
                    <Controller
                        name="price"
                        control={control}
                        render={({field}) => (
                            <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.price?.message}
                            />
                        )}
                    />
                </Field>
                <Field label={"Stock"}>
                    <Input
                        type="number"
                        error={errors.stock?.message}
                        registration={register("stock", {valueAsNumber: true})}
                    />
                </Field>
                <Field label={"Marca"}>
                    <Input
                        type="text"
                        error={errors.brand?.message}
                        registration={register("brand")}
                    />
                </Field>
                <Field label={"Categoria"}>
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({field}) => (
                            <StatusSelect
                                value={field.value ? String(field.value) : ""}
                                options={categoryOptions}
                                placeholder={isLoadingCategories ? "Cargando..." : "Selecciona una categoría"}
                                disabled={isLoadingCategories}
                                onChange={(value) => field.onChange(Number(value))}
                                className={"sm:w-full"}
                            />
                        )}
                    />
                    <FieldError message={errors.categoryId?.message}/>
                </Field>
            </FormGrid>

            <div className="flex justify-end mt-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !isDirty}
                    className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors"
                >
                    {isPending && <Loader size="sm"/>}
                    {isPending ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </div>
        </FormCard>
    )
}