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
            variant="modal"
            onSubmit={onSubmit}
            header={<FormTitle title={"Actualizar producto"} titleImage={{src: "/ActualizarProducto.webp", width: 1200, height: 400}}/>}
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

            <div className="mt-4 flex justify-end max-sm:sticky max-sm:-bottom-4 max-sm:-mx-4 max-sm:mt-0 max-sm:border-t max-sm:border-zinc-100 max-sm:bg-white max-sm:px-4 max-sm:pt-3 max-sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit}
                    className="flex items-center justify-center gap-2 max-sm:w-full text-sm rounded-lg px-6 py-2.5 transition-colors"
                >
                    {isPending && <Loader size="sm"/>}
                    {isPending ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </div>
        </FormCard>
    )
}
