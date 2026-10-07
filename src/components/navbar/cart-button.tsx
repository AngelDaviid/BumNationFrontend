import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/cart';

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
    >
      <div className="relative">
        <ShoppingCart size={22} />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-4 min-w-4 p-0 px-1 flex items-center justify-center text-[10px] bg-neon text-black border-0">
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </div>
    </Link>
  );
}
