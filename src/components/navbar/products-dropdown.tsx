import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types';

interface ProductsDropdownProps {
  categories: Category[];
}

export function ProductsDropdown({ categories }: ProductsDropdownProps) {
  return (
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
  );
}