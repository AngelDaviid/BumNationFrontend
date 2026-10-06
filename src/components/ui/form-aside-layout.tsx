import { ReactNode } from 'react';

interface FormAsideLayoutProps {
  children: ReactNode;
  aside: ReactNode;
}

export function FormAsideLayout({ children, aside }: FormAsideLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
      <div className="min-w-0">{children}</div>
      <div className="w-full max-md:order-first md:max-w-80">{aside}</div>
    </div>
  );
}
