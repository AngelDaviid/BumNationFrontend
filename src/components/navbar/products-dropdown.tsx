import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types';

interface ProductsDropdownProps {
  categories: Category[];
  isActive?: boolean;
}

export function ProductsDropdown({ categories, isActive = false }: ProductsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center cursor-pointer gap-1 text-sm font-medium transition-colors outline-none ${
          isActive ? 'text-neon' : 'text-zinc-300 hover:text-white'
        }`}
      >
        Productos <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white" align="start">
        <DropdownMenuItem asChild className="text-md w-auto">
          <Link href="/products" className="cursor-pointer hover:text-neon">
            Ver todos
          </Link>
        </DropdownMenuItem>
        {categories.length > 0 && <DropdownMenuSeparator className="bg-zinc-700" />}
        {categories.map((cat) => (
          <DropdownMenuItem key={cat.id} asChild className="text-md w-auto">
            <Link href={`/products?category=${cat.id}`} className="cursor-pointer hover:text-neon">
              {cat.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
