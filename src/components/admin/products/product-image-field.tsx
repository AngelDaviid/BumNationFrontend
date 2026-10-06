"use client"

import {ImageUpload} from "@/components/ui/image-uploader";

interface ProductImageFieldProps {
    imageUrl?: string | null;
    onChange: (file: File | null) => void;
    isUploading?: boolean;
}

export function ProductImageField({imageUrl, onChange, isUploading}: ProductImageFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">Imagen</label>
            <ImageUpload
                value={imageUrl}
                onChange={onChange}
                isUploading={isUploading}
                fit="contain"
                className="aspect-square h-auto w-full bg-zinc-50 max-md:aspect-auto max-md:h-40"
            />
        </div>
    )
}
