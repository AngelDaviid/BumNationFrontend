import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, X } from 'lucide-react';
import { RefObject } from 'react';
import { Category } from '@/types';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';
import { useMobileSearch } from '@/hooks/search/use-mobile-search';
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

const iconButtonClass =
  'flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors';

export function MobileNavbar({ categories, search, menu, containerRef, dropdown }: MobileNavbarProps) {
  const mobileSearch = useMobileSearch();

  const openSearch = () => {
    menu.close();
    mobileSearch.open();
  };

  const closeSearch = () => {
    dropdown.close();
    mobileSearch.close();
  };

  return (
    <div className="md:hidden">
      {mobileSearch.isOpen ? (
        <div className="flex h-16 items-center gap-2 px-4">
          <div className="min-w-0 flex-1">
            <SearchBar
              containerRef={containerRef}
              search={search}
              dropdown={dropdown}
              onSubmitClose={closeSearch}
              variant="mobile"
              autoFocus
            />
          </div>
          <button type="button" onClick={closeSearch} aria-label="Cerrar búsqueda" className={`-mr-2 ${iconButtonClass}`}>
            <X size={22} />
          </button>
        </div>
      ) : (
        <div className="flex h-16 items-center gap-2 px-4">
          <button
            type="button"
            onClick={menu.toggle}
            aria-label={menu.isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu.isOpen}
            className={`-ml-2 ${iconButtonClass}`}
          >
            {menu.isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" onClick={menu.close} className="shrink-0">
            <Image src="/Logo.webp" alt="Bum Nation" width={72} height={48} className="h-12 w-auto object-contain" />
          </Link>

          <div className="-mr-2 ml-auto flex items-center gap-1">
            <button type="button" onClick={openSearch} aria-label="Buscar productos" className={iconButtonClass}>
              <Search size={22} />
            </button>
            <CartButton />
          </div>
        </div>
      )}

      <MobileMenu categories={categories} menu={menu} />
    </div>
  );
}
