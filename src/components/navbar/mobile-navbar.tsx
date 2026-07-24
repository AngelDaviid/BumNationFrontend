import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { RefObject } from 'react';
import { Category } from '@/types';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';
import { SearchBar } from './search-navbar';
import { CartButton } from './cart-button';
import { MobileMenu } from './mobile-menu';


interface MobileNavbarProps {
  categories: Category[];
  search: ReturnType<typeof useProductSearch>;
  menu: ReturnType<typeof useMobileMenu>;
  containerRef: RefObject<HTMLDivElement | null>;
  dropdown: ReturnType<typeof useSearchDropdown>;
}

export function MobileNavbar({ categories, search, menu, containerRef, dropdown }: MobileNavbarProps) {
  return (
    <>
      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] flex items-center justify-between bg-zinc-900 rounded-2xl px-4 py-3 shadow-xl">
        <Link href="/" onClick={menu.close}>
          <Image src="/Logo.png" alt="Bum Nation" width={80} height={80} className="object-contain" />
        </Link>

        <SearchBar
          containerRef={containerRef}
          search={search}
          dropdown={dropdown}
          onSubmitClose={menu.close}
          variant="mobile"
        />

        <div className="flex items-center gap-3">
          <CartButton variant="mobile" />

          <button
            type="button"
            onClick={menu.toggle}
            aria-label={menu.isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu.isOpen}
            className="flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          >
            {menu.isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <MobileMenu categories={categories} menu={menu} />
    </>
  );
}