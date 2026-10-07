import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, User, LogIn, ChevronDown, Heart } from 'lucide-react';
import { Category } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/auth-hook/use-logout';
import { useMobileMenu } from '@/hooks/search/use-mobiel-menu';

interface MobileMenuProps {
  categories: Category[];
  menu: ReturnType<typeof useMobileMenu>;
}

export function MobileMenu({ categories, menu }: MobileMenuProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const logout = useLogout();

  if (!menu.isOpen) return null;

  return (
    <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-black/60" onClick={menu.close}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-full overflow-y-auto overscroll-contain border-b border-zinc-800 bg-zinc-900 px-4 py-3 flex flex-col gap-1"
      >
        <Link
          onClick={menu.close}
          href="/"
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
            pathname === '/' ? 'text-neon bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
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
              onClick={menu.close}
              href="/products"
              className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-neon hover:bg-zinc-800 transition-colors"
            >
              Ver todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                onClick={menu.close}
                href={`/products?category=${cat.id}`}
                className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-neon hover:bg-zinc-800 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <Link
          onClick={menu.close}
          href="/about"
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
            pathname === '/about' ? 'text-neon bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          Sobre nosotros
        </Link>

        <div className="my-2 h-px bg-zinc-800" />

        {!hasHydrated ? null : isAuthenticated ? (
          <>
            <div className="px-3 py-1.5 text-xs text-zinc-500">
              {user?.firstName} {user?.firstLastName}
            </div>
            <Link
              onClick={menu.close}
              href="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <User size={18} />
              Mi perfil
            </Link>
            <Link
              onClick={menu.close}
              href="/favorites"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Heart size={18} />
              Mis favoritos
            </Link>
            <Link
              onClick={menu.close}
              href="/orders"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Mis pedidos
            </Link>
            <Link
              onClick={menu.close}
              href="/membership"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Mi membresía
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                onClick={menu.close}
                href="/admin"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-neon hover:bg-zinc-800 transition-colors"
              >
                Panel Admin
              </Link>
            )}
            <div className="my-2 h-px bg-zinc-800" />
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors text-left"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            onClick={menu.close}
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