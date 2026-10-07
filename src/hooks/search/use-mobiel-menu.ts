import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

export function useMobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsProductsOpen(false);
  }

  useBodyScrollLock(isOpen);

  return {
    isOpen,
    toggle: () => setIsOpen((open) => !open),
    close: () => setIsOpen(false),
    isProductsOpen,
    toggleProducts: () => setIsProductsOpen((open) => !open),
  };
}