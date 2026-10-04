"use client"

import {UpdateProductFormValues} from "@/common/schemas/product.schema";
import {useEditProductForm} from "@/hooks/products/use-edit-product-form";
import {FormCard} from "@/components/ui/form-card";
import {FormTitle} from "@/components/ui/form-title";
import {FormAsideLayout} from "@/components/ui/form-aside-layout";
import {Button} from "@/components/ui/button";
import {Loader} from "@/components/ui/loader";
import {ProductImageField} from "@/components/admin/products/product-image-field";
import {ProductFormFields} from "@/components/admin/products/product-form-fields";


interface EditProductFormProps {
    productId: number;
    defaultValues: UpdateProductFormValues;
    imageUrl?: string | null;
    onSuccess?: () => void;
}

export function EditProductsForm({productId, defaultValues, imageUrl, onSuccess}: EditProductFormProps) {
    const {
        register,
        control,
        errors,
        onSubmit,
        isPending,
        canSubmit,
        categoryOptions,
        isLoadingCategories,
        imageUrl: currentImageUrl,
        handleImageChange,
    } = useEditProductForm({productId, defaultValues, imageUrl, onSuccess})

    return (
        <FormCard
            onSubmit={onSubmit}
            header={<FormTitle title={"Actualizar producto"} titleImage={{src: "/ActualizarProducto.svg", width: 1200, height: 125}}/>}
            maxWidth={"4xl"}
        >
            <FormAsideLayout
                aside={
                    <ProductImageField
                        imageUrl={currentImageUrl}
                        onChange={handleImageChange}
                        isUploading={isPending}
                    />
                }
            >
                <ProductFormFields
                    register={register}
                    control={control}
                    errors={errors}
                    categoryOptions={categoryOptions}
                    isLoadingCategories={isLoadingCategories}
                />
            </FormAsideLayout>

            <div className="flex justify-end mt-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit}
                    className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors"
                >
                    {isPending && <Loader size="sm"/>}
                    {isPending ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </div>
        </FormCard>
    )
}
