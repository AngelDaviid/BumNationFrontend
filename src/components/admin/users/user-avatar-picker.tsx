"use client"

import {ChangeEvent, useEffect, useMemo} from "react";
import Image from "next/image";
import {Camera} from "lucide-react";

interface UserAvatarPickerProps {
    imageUrl?: string | null;
    initials: string;
    file: File | null;
    onChange: (file: File | null) => void;
    disabled?: boolean;
}

export function UserAvatarPicker({imageUrl, initials, file, onChange, disabled}: UserAvatarPickerProps) {
    const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => () => {
        if (preview) URL.revokeObjectURL(preview);
    }, [preview]);

    const src = file ? preview : imageUrl;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];
        if (selected) onChange(selected);
        event.target.value = "";
    };

    return (
        <label className={`group relative size-20 shrink-0 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
            <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-xl font-semibold text-zinc-600">
                {src ? (
                    <Image src={src} alt="Foto del usuario" width={80} height={80} unoptimized={!!file} className="size-full object-cover"/>
                ) : (
                    initials
                )}
            </span>
            <span className="absolute -right-0.5 -bottom-0.5 flex size-7 items-center justify-center rounded-full bg-white text-zinc-600 shadow transition-colors group-hover:text-zinc-900">
                <Camera size={14}/>
            </span>
            <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleChange}
                disabled={disabled}
                aria-label="Cambiar foto"
            />
        </label>
    )
}
