import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateProductFormValues, createProductSchema} from "@/common/schemas/product.schema";
import {useCreateProduct} from "@/hooks/products/use-create-product";
import {useUploadProductImage} from "@/hooks/products/use-upload-product-image";
import {useCategories} from "@/hooks/categories/use-categories";

const EMPTY_PRODUCT: CreateProductFormValues = {
    name: "",
    description: "",
    price: "",
    stock: 1,
    brand: "",
    categoryId: 0,
};

export function useCreateProductForm({onSuccess}: { onSuccess?: () => void }) {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<CreateProductFormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: EMPTY_PRODUCT,
    })

    const [image, setImage] = useState<File | null>(null)

    const createProduct = useCreateProduct()
    const uploadImage = useUploadProductImage()
    const {categories, isLoading: isLoadingCategories} = useCategories()

    const categoryOptions = categories.map((category) => ({
        value: String(category.id),
        label: category.name,
    }))

    const isPending = createProduct.isPending || uploadImage.isPending

    const onSubmit = handleSubmit(async (data) => {
        try {
            const product = await createProduct.mutateAsync({
                name: data.name,
                description: data.description || undefined,
                price: Number(data.price),
                stock: data.stock,
                brand: data.brand || undefined,
                categoryId: data.categoryId,
                isActive: true,
            })

            if (image) {
                await uploadImage.mutateAsync({id: product.id, file: image})
            }

            onSuccess?.()
        } catch {
            // Cada mutación ya muestra su propio toast de error
        }
    });

    return {
        register,
        control,
        errors,
        onSubmit,
        isPending,
        categoryOptions,
        isLoadingCategories,
        handleImageChange: setImage,
    };
}
