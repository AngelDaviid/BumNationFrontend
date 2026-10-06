import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/cart';

interface CartButtonProps {
  variant?: 'desktop' | 'mobile';
}

export function CartButton({ variant = 'desktop' }: CartButtonProps) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
      className={`flex items-center text-zinc-300 hover:text-white transition-colors relative ${
        variant === 'desktop' ? 'flex-col justify-center' : 'justify-center'
      }`}
    >
      <div className="relative">
        <ShoppingCart size={22} />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-4 min-w-4 p-0 px-1 flex items-center justify-center text-[10px] bg-neon text-black border-0">
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </div>
      {variant === 'desktop' && <span className="text-md mt-0.5">Carrito</span>}
    </Link>
  );
}
