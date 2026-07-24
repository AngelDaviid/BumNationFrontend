import { ReactNode } from 'react';

interface FormGridProps {
  columns?: 1 | 2;
  children: ReactNode;
}

export function FormGrid({ columns = 1, children }: FormGridProps) {
  if (columns === 1) {
    return <div className="flex flex-col gap-4">{children}</div>;
  }
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}