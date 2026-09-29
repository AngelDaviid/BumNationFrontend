'use client';

import { UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';

interface InputProps {
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'none' | 'search' | 'decimal';
  registration: UseFormRegisterReturn;
  rightElement?: ReactNode; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

function inputClass(hasError: boolean) {
  return `bg-zinc-100 text-zinc-800 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 transition-shadow w-full ${
    hasError ? 'ring-1 ring-red-400 focus:ring-red-400' : 'focus:ring-[#6BFF3C]'
  }`;
}

export function Input({
  label,
  error,
  type = 'text',
  placeholder,
  inputMode,
  registration,
  rightElement,
  onChange,
  value,
  className,
  onFocus,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}

      <div className="relative">
        <input
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            className={`${inputClass(!!error)} ${rightElement ? 'pr-10' : ''} ${className || ''}`}
            onFocus={onFocus}
            {...registration}
            onChange={(e) => {
              registration.onChange(e);
              onChange?.(e);
            }}
            value={value}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}