"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ImageUploadProps {
  value?: string | null;       
  onChange: (file: File | null) => void;
  isUploading?: boolean;
  shape?: "circle" | "square"; 
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  isUploading = false,
  shape = "square",
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxSize: 5 * 1024 * 1024, 
    maxFiles: 1,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div
      {...getRootProps()}
      data-file-trigger
      className={cn(
        "relative flex items-center justify-center border-2 border-dashed cursor-pointer transition-colors overflow-hidden",
        shape === "circle" ? "rounded-full w-32 h-32" : "rounded-md w-full h-48",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        className
      )}
    >
      <input {...getInputProps()} />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}

      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 z-20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-1 text-muted-foreground text-sm p-4 text-center">
          <ImagePlus className="w-6 h-6" />
          <span>{isDragActive ? "Soltá la imagen acá" : "Arrastrá o hacé click"}</span>
        </div>
      )}
    </div>
  );
}