'use client'

import { FieldError } from './field-error';

export const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string ;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  );
}