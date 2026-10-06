import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpdateProductFormValues, updateProductSchema} from "@/common/schemas/product.schema";
import {useUpdateProducts} from "@/hooks/products/use-update-products";
import {useUploadProductImage} from "@/hooks/products/use-upload-product-image";
import {useRemoveProductImage} from "@/hooks/products/use-remove-product-image";
import {useCategories} from "@/hooks/categories/use-categories";
import {Product} from "@/types";

export function toProductFormValues(product: Product): UpdateProductFormValues {
    return {
        name: product.name,
        description: product.description,
        price: String(product.price),
        stock: product.stock,
        brand: product.brand,
        categoryId: product.categoryId,
    };
}

interface UseEditProductFormProps {
    productId: number;
    defaultValues: UpdateProductFormValues;
    imageUrl?: string | null;
    onSuccess?: () => void;
}

export function useEditProductForm({productId, defaultValues, imageUrl, onSuccess}: UseEditProductFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {errors, isDirty},
    } = useForm<UpdateProductFormValues>({
        resolver: zodResolver(updateProductSchema),
        defaultValues,
    })

    const [savedImageUrl, setSavedImageUrl] = useState(imageUrl ?? null)
    const [newImage, setNewImage] = useState<File | null>(null)
    const [isImageRemoved, setIsImageRemoved] = useState(false)

    const updateProduct = useUpdateProducts()
    const uploadImage = useUploadProductImage()
    const removeImage = useRemoveProductImage()
    const {categories, isLoading: isLoadingCategories} = useCategories()

    const categoryOptions = categories.map((category) => ({
        value: String(category.id),
        label: category.name,
    }))

    const handleImageChange = (file: File | null) => {
        setNewImage(file)
        setIsImageRemoved(!file && !!savedImageUrl)
    }

    const hasImageChanges = newImage !== null || isImageRemoved
    const isPending = updateProduct.isPending || uploadImage.isPending || removeImage.isPending

    const onSubmit = handleSubmit(async (data) => {
        try {
            let updatedProduct: Product | null = null

            if (isDirty) {
                updatedProduct = await updateProduct.mutateAsync({id: productId, data})
            }

            if (newImage) {
                updatedProduct = await uploadImage.mutateAsync({id: productId, file: newImage})
            } else if (isImageRemoved) {
                updatedProduct = await removeImage.mutateAsync(productId)
            }

            if (updatedProduct) {
                reset(toProductFormValues(updatedProduct))
                setSavedImageUrl(updatedProduct.imageUrl)
            }
            setNewImage(null)
            setIsImageRemoved(false)
            onSuccess?.()
        } catch {
        }
    });

    return {
        register,
        control,
        errors,
        onSubmit,
        isPending,
        canSubmit: (isDirty || hasImageChanges) && !isPending,
        categoryOptions,
        isLoadingCategories,
        imageUrl: savedImageUrl,
        handleImageChange,
    };
}
