import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, User, LogIn, ChevronDown } from 'lucide-react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Category } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';

interface MobileMenuProps {
  categories: Category[];
  menu: ReturnType<typeof useMobileMenu>;
}

export function MobileMenu({ categories, menu }: MobileMenuProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!menu.isOpen) return null;

  return (
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
            <Link
              href="/products"
              className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-[#6BFF3C] hover:bg-zinc-800 transition-colors"
            >
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
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <User size={18} />
              Mi perfil
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Mis órdenes
            </Link>
            <Link
              href="/membership"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Mi membresía
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-[#6BFF3C] hover:bg-zinc-800 transition-colors"
              >
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
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <LogIn size={18} />
            LogIn
          </Link>
        )}
      </div>
    </div>
  );
}