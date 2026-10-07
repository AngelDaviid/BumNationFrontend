import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/utils";


interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

export function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="absolute top-2 right-2 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60"
    >
      <Heart
        className={cn("size-5 transition-colors", isFavorite ? "fill-brand text-brand" : "text-white")}
        strokeWidth={2}
      />
    </Button>
  );
}

interface AddToCartButtonProps {
  isOutOfStock: boolean;
  isAdding: boolean;
  onClick: () => void;
}

export function AddToCartButton({ isOutOfStock, isAdding, onClick }: AddToCartButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isOutOfStock || isAdding}
      className="h-9 w-full rounded-sm text-xs sm:h-10 sm:text-sm"
    >
      {isAdding ? <Loader size="sm" /> : <ShoppingCart className="size-4 sm:size-5" strokeWidth={2} />}
      {isOutOfStock ? "Sin stock" : isAdding ? "Agregando…" : "Agregar"}
    </Button>
  );
}
