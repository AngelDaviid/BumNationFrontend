import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { RefObject } from 'react';
import { Category } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { ProductsDropdown } from './products-dropdown';
import { SearchBar } from './search-navbar';
import { UserMenu } from './user-menu';
import { CartButton } from './cart-button';
import {BrandLogo} from "@/components/shop/brand-divider";


interface DesktopNavbarProps {
  categories: Category[];
  search: ReturnType<typeof useProductSearch>;
  containerRef: RefObject<HTMLDivElement | null>;
  dropdown: ReturnType<typeof useSearchDropdown>;
}

const linkClass = (isActive: boolean) =>
  `text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'text-neon' : 'text-zinc-300 hover:text-white'}`;

export function DesktopNavbar({ categories, search, containerRef, dropdown }: DesktopNavbarProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <div className="hidden h-20 md:block">
  <div className="flex pt-2 lg:gap-8 lg:px-8">
      <Link href="/" className="shrink-0">
        <BrandLogo logo="performance" priority className="h-8 sm:h-16" />
      </Link>

        {isAdmin ? (
          <nav className="flex flex-1 items-center">
            <Link href="/admin" className={linkClass(pathname === '/admin')}>
              Inicio
            </Link>
          </nav>
        ) : (
          <div className={`flex flex-1 items-center gap-6 lg:gap-8 ${hasHydrated ? '' : 'invisible'}`}>
            <nav className="flex items-center gap-6">
              <Link href="/" className={linkClass(pathname === '/')}>
                Inicio
              </Link>

              <ProductsDropdown categories={categories} isActive={pathname.startsWith('/products')} />

              <Link href="/about" className={linkClass(pathname === '/about')}>
                Sobre nosotros
              </Link>
            </nav>

            <div className="ml-auto w-full max-w-md">
              <SearchBar containerRef={containerRef} search={search} dropdown={dropdown} variant="desktop" />
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-1">
          <UserMenu />
          <CartButton />
        </div>
      </div>
    </div>
  );
}
