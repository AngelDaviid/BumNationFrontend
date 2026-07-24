import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { RefObject } from 'react';
import { Category } from '@/types';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { ProductsDropdown } from './products-dropdown';
import { SearchBar } from './search-navbar';
import { UserMenu } from './user-menu';
import { CartButton } from './cart-button';


interface DesktopNavbarProps {
  categories: Category[];
  search: ReturnType<typeof useProductSearch>;
  containerRef: RefObject<HTMLDivElement | null>;
  dropdown: ReturnType<typeof useSearchDropdown>;
}

export function DesktopNavbar({ categories, search, containerRef, dropdown }: DesktopNavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl items-center justify-between space-x-4 bg-zinc-900 rounded-2xl px-6 py-3 shadow-xl">
      <Link href="/">
        <Image src="/Logo.png" alt="Bum Nation" width={100} height={100} className="object-contain" />
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          className={`text-md font-medium transition-colors ${
            pathname === '/' ? 'text-[#6BFF3C]' : 'text-zinc-300 hover:text-white'
          }`}
        >
          Inicio
        </Link>

        <ProductsDropdown categories={categories} />

        <Link href="/about" className="text-md font-medium text-zinc-300 hover:text-white transition-colors">
          Sobre nosotros
        </Link>
      </div>

      <SearchBar containerRef={containerRef} search={search} dropdown={dropdown} variant="desktop" />

      <div className="flex items-center gap-4">
        <UserMenu />
        <CartButton variant="desktop" />
      </div>
    </nav>
  );
}