import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart.store';

interface CartButtonProps {
  variant?: 'desktop' | 'mobile';
}

export function CartButton({ variant = 'desktop' }: CartButtonProps) {
  const { itemCount } = useCartStore();

  return (
    <Link
      href="/cart"
      className={`flex items-center text-zinc-300 hover:text-white transition-colors relative ${
        variant === 'desktop' ? 'flex-col justify-center' : 'justify-center'
      }`}
    >
      <div className="relative">
        <ShoppingCart size={22} />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#6BFF3C] text-black border-0">
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </div>
      {variant === 'desktop' && <span className="text-md mt-0.5">Carrito</span>}
    </Link>
  );
}