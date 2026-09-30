import { useState } from "react";

// Cantidad entre 1 y el stock disponible
export function useQuantitySelector(max: number) {
  const [quantity, setQuantity] = useState(1);
  const safeMax = Math.max(max, 1);
  const value = Math.min(quantity, safeMax);

  return {
    quantity: value,
    canDecrement: value > 1,
    canIncrement: value < max,
    increment: () => setQuantity(Math.min(value + 1, safeMax)),
    decrement: () => setQuantity(Math.max(value - 1, 1)),
    reset: () => setQuantity(1),
  };
}
