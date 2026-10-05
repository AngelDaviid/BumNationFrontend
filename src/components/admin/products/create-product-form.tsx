"use client"

import {useCreateProductForm} from "@/hooks/products/use-create-product-form";
import {FormCard} from "@/components/ui/form-card";
import {FormTitle} from "@/components/ui/form-title";
import {FormAsideLayout} from "@/components/ui/form-aside-layout";
import {Button} from "@/components/ui/button";
import {Loader} from "@/components/ui/loader";
import {ProductFormFields} from "@/components/admin/products/product-form-fields";
import {ProductImageField} from "@/components/admin/products/product-image-field";

interface CreateProductFormProps {
    onSuccess?: () => void;
}

export function CreateProductForm({onSuccess}: CreateProductFormProps) {
    const {
        register,
        control,
        errors,
        onSubmit,
        isPending,
        categoryOptions,
        isLoadingCategories,
        handleImageChange,
    } = useCreateProductForm({onSuccess})

    return (
        <FormCard
            variant="modal"
            onSubmit={onSubmit}
            header={<FormTitle title={"Agregar producto"} titleImage={{src: "/AgregarProducto.webp", width: 1200, height: 400}}/>}
            maxWidth={"4xl"}
        >
            <FormAsideLayout
                aside={
                    <ProductImageField
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
                    disabled={isPending}
                    className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors"
                >
                    {isPending && <Loader size="sm"/>}
                    {isPending ? 'Creando...' : 'Crear producto'}
                </Button>
            </div>
        </FormCard>
    )
}
