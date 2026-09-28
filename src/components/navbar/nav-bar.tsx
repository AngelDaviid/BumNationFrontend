'use client';

import { useEffect, useRef, useState } from 'react';
import { Category } from '@/types';
import { categoriesApi } from '@/lib/api/categories';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);

  const menu = useMobileMenu();
  const search = useProductSearch();

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopDropdown = useSearchDropdown(desktopContainerRef);
  const mobileDropdown = useSearchDropdown(mobileContainerRef);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

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
