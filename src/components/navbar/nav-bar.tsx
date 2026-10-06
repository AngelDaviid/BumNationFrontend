'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

export default function Navbar() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const menu = useMobileMenu();
  const search = useProductSearch();

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopDropdown = useSearchDropdown(desktopContainerRef);
  const mobileDropdown = useSearchDropdown(mobileContainerRef);

  return (
    <>
      <DesktopNavbar
        categories={categories}
        search={search}
        containerRef={desktopContainerRef}
        dropdown={desktopDropdown}
      />

      <MobileNavbar
        categories={categories}
        search={search}
        menu={menu}
        containerRef={mobileContainerRef}
        dropdown={mobileDropdown}
      />

      <div className="h-20" />
    </>
  );
}
