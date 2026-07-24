'use client'

import { ReactNode } from "react";

interface FormCardProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    error?: string | null;
    maxWidth?: 'sm' | 'md' | 'lg' | '2xl';
}

const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    '2xl': 'max-w-2xl',
}

export function FormCard({
    onSubmit,
    children,
    header,
    footer,
    error,
    maxWidth = 'md',
}: FormCardProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-10">
            <div className={`w-full ${maxWidthMap[maxWidth]} bg-white rounded-3xl shadow-2xl p-8 sm:p-10`}>
                {header}

                {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                    {error}
                </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                {children}
                {footer && <div className="flex items-center justify-between mt-3">{footer}</div>}
                </form>
            </div>
        </div>
  );
}