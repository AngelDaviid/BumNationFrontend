'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useSyncExternalStore } from 'react';
import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  Tags,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import { LoadingState } from './admin-ui';

const NAV_ITEMS = [
  { href: '/admin', label: 'Resumen', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/memberships', label: 'Membresías', icon: CreditCard },
  { href: '/admin/orders', label: 'Órdenes', icon: ClipboardList },
  { href: '/admin/inventory', label: 'Inventario', icon: Package },
  { href: '/admin/categories', label: 'Categorías', icon: Tags },
];

const subscribe = () => () => {};

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  // La sesión vive en una cookie que solo se lee en el navegador
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  useEffect(() => {
    if (!isClient) return;
    if (!isAuthenticated) router.replace('/login');
    else if (!isAdmin) router.replace('/');
  }, [isClient, isAuthenticated, isAdmin, router]);

  if (!isClient || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <LoadingState label="Verificando acceso…" />
      </div>
    );
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-100">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
          <Image src="/Logo.png" alt="Bum Nation" width={36} height={36} />
          <div>
            <p className="text-sm font-bold text-white">Bum Nation</p>
            <p className="text-xs text-[#6BFF3C]">Panel admin</p>
          </div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive(href)
                  ? 'bg-[#6BFF3C]/10 font-semibold text-[#6BFF3C]'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-zinc-800 p-3">
          <p className="truncate px-3 pb-1 text-xs text-zinc-500">
            {user?.firstName} {user?.firstLastName}
          </p>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Store size={18} /> Ver tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <nav className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-zinc-800 bg-zinc-900 px-2 py-2 md:hidden">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs',
                isActive(href) ? 'bg-[#6BFF3C]/10 font-semibold text-[#6BFF3C]' : 'text-zinc-400',
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
