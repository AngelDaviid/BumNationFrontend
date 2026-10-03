'use client'

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return <p className={`text-xs text-red-500 ${className ?? ''}`}>{message}</p>;
}
