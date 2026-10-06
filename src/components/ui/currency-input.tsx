'use client'

import { formatCOP, parseCOP } from '@/lib/utils/currency';
import { Input } from './input';

interface CurrencyInputProps {
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function CurrencyInput({ value, onChange, error, placeholder = '$ 0', className }: CurrencyInputProps) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      error={error}
      className={className}
      value={value === '' ? '' : formatCOP(value)}
      onChange={(e) => onChange(parseCOP(e.target.value))}
    />
  );
}
