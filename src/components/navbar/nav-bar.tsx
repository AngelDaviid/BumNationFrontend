'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';import {
  Home,
  Grid2X2,
  ShoppingCart,
  User,
  ChevronDown,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useEffect, useRef, useState } from 'react';
import { Category } from '@/types';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { categoriesApi } from '@/lib/api/categories';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';


export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount } = useCartStore();
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

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center cursor-pointer gap-1 text-md font-medium text-zinc-300 hover:text-white transition-colors outline-none">
              Productos <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} asChild className="text-md w-auto">
                  <Link href={`/products?category=${cat.id}`} className="cursor-pointer hover:text-[#6BFF3C]">
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="text-md font-medium text-zinc-300 hover:text-white transition-colors">
            Sobre nosotros
          </Link>
        </div>

        <div ref={desktopContainerRef} className="relative w-100">
          <form
            onSubmit={(e) => search.handleSubmit(e)}
            className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 w-full"
          >
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search.query}
              onChange={(e) => search.setQuery(e.target.value)}
              onFocus={desktopDropdown.open}
              placeholder="¿Qué estás buscando?"
              className="bg-transparent text-md text-zinc-300 placeholder-zinc-500 outline-none w-full"
            />
          </form>

          {desktopDropdown.isOpen && search.showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              {search.isLoadingSuggestions && (
                <p className="px-4 py-3 text-sm text-zinc-500">Buscando…</p>
              )}
              {!search.isLoadingSuggestions && search.suggestions.length === 0 && (
                <p className="px-4 py-3 text-sm text-zinc-500">Sin resultados</p>
              )}
              {!search.isLoadingSuggestions &&
                search.suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    // onClick={() => search.onSelectSuggestion(product.id, desktopDropdown.close)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="truncate">{product.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-col items-center text-zinc-300 hover:text-white transition-colors outline-none">
                <User size={22} />
                <span className="text-md mt-0.5">Cuenta</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white" align="end">
                <div className="px-2 py-1.5 text-xs text-zinc-400">
                  {user?.firstName} {user?.firstLastName}
                </div>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer hover:text-[#6BFF3C]">Mi perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer hover:text-[#6BFF3C]">Mis órdenes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/membership" className="cursor-pointer hover:text-[#6BFF3C]">Mi membresía</Link>
                </DropdownMenuItem>
                {user?.role === 'ADMIN' && (
                  <>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-[#6BFF3C]">Panel Admin</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:text-red-300">
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 text-md font-medium text-zinc-300 hover:text-white transition-colors">
              <LogIn size={22} />
              LogIn
            </Link>
          )}

          <Link href="/cart" className="flex flex-col items-center text-zinc-300 hover:text-white transition-colors relative">
            <div className="relative">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#6BFF3C] text-black border-0">
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </div>
            <span className="text-md mt-0.5">Carrito</span>
          </Link>
        </div>
      </nav>

      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] flex items-center justify-between bg-zinc-900 rounded-2xl px-4 py-3 shadow-xl">
        <Link href="/" onClick={menu.close}>
          <Image src="/Logo.png" alt="Bum Nation" width={80} height={80} className="object-contain" />
        </Link>

        <div ref={mobileContainerRef} className="relative flex-1 mx-2">
          <form
            onSubmit={(e) => search.handleSubmit(e, menu.close)}
            className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2.5"
          >
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search.query}
              onChange={(e) => search.setQuery(e.target.value)}
              onFocus={mobileDropdown.open}
              placeholder="¿Qué estás buscando?"
              className="bg-transparent text-sm text-zinc-300 placeholder-zinc-500 outline-none w-full"
            />
          </form>

          {mobileDropdown.isOpen && search.showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              {search.isLoadingSuggestions && (
                <p className="px-4 py-3 text-sm text-zinc-500">Buscando…</p>
              )}
              {!search.isLoadingSuggestions && search.suggestions.length === 0 && (
                <p className="px-4 py-3 text-sm text-zinc-500">Sin resultados</p>
              )}
              {!search.isLoadingSuggestions &&
                search.suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    //onClick={() => search.onSelectSuggestion(product.id, mobileDropdown.close)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="truncate">{product.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative flex items-center justify-center text-zinc-300 hover:text-white transition-colors">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#6BFF3C] text-black border-0">
                {itemCount > 99 ? '99+' : itemCount}
              </Badge>
            )}
          </Link>

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

      {menu.isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[92%] max-h-[75vh] overflow-y-auto bg-zinc-900 rounded-2xl px-5 py-5 shadow-2xl flex flex-col gap-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname === '/' ? 'text-[#6BFF3C] bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Home size={18} />
              Inicio
            </Link>

            <button
              type="button"
              onClick={menu.toggleProducts}
              className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-3">
                <Grid2X2 size={18} />
                Productos
              </span>
              <ChevronDown size={16} className={`transition-transform ${menu.isProductsOpen ? 'rotate-180' : ''}`} />
            </button>

            {menu.isProductsOpen && (
              <div className="ml-9 flex flex-col gap-1 mb-1">
                <Link href="/products" className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-[#6BFF3C] hover:bg-zinc-800 transition-colors">
                  Ver todos
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-[#6BFF3C] hover:bg-zinc-800 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/about"
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname === '/about' ? 'text-[#6BFF3C] bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              Sobre nosotros
            </Link>

            <DropdownMenuSeparator className="bg-zinc-700 my-2" />

            {isAuthenticated ? (
              <>
                <div className="px-3 py-1.5 text-xs text-zinc-500">
                  {user?.firstName} {user?.firstLastName}
                </div>
                <Link href="/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <User size={18} />
                  Mi perfil
                </Link>
                <Link href="/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  Mis órdenes
                </Link>
                <Link href="/membership" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  Mi membresía
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-[#6BFF3C] hover:bg-zinc-800 transition-colors">
                    Panel Admin
                  </Link>
                )}
                <DropdownMenuSeparator className="bg-zinc-700 my-2" />
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors text-left"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <LogIn size={18} />
                LogIn
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="hidden md:block h-20" />
      <div className="md:hidden h-20" />
    </>
  );
}