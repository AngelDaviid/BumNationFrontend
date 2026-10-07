'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';
import { useMobileSearch } from '@/hooks/search/use-mobile-search';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { useHeroHeader } from '@/hooks/use-hero-header';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

const solidBackground = 'bg-zinc-900 shadow-[0_1px_0_0_var(--color-zinc-800)]';

export default function Navbar() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const menu = useMobileMenu();
  const mobileSearch = useMobileSearch();
  const search = useProductSearch();
  const { overlaysHero, isSolid, isForcedSolid } = useHeroHeader(menu.isOpen || mobileSearch.isOpen);

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopDropdown = useSearchDropdown(desktopContainerRef);
  const mobileDropdown = useSearchDropdown(mobileContainerRef);

  return (
    <header className={`${overlaysHero ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 w-full`}>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${
          isSolid ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${solidBackground} transition-opacity duration-300 ${
          isSolid ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {isForcedSolid && <div aria-hidden className={`pointer-events-none absolute inset-0 ${solidBackground}`} />}

      <div className="relative">
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
          mobileSearch={mobileSearch}
          containerRef={mobileContainerRef}
          dropdown={mobileDropdown}
        />
      </div>
    </header>
  );
}
