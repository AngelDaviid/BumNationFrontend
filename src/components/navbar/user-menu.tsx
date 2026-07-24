import Link from 'next/link';
import { User, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth.store';

export function UserMenu() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-md font-medium text-zinc-300 hover:text-white transition-colors"
      >
        <LogIn size={22} />
        LogIn
      </Link>
    );
  }

  return (
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
          <Link href="/profile" className="cursor-pointer hover:text-[#6BFF3C]">
            Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer hover:text-[#6BFF3C]">
            Mis órdenes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/membership" className="cursor-pointer hover:text-[#6BFF3C]">
            Mi membresía
          </Link>
        </DropdownMenuItem>
        {user?.role === 'ADMIN' && (
          <>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer text-[#6BFF3C]">
                Panel Admin
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:text-red-300">
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}