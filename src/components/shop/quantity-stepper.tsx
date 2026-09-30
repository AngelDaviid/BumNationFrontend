import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
  disabled?: boolean;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDecrement}
        disabled={disabled || !canDecrement}
        aria-label="Quitar una unidad"
        className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
      >
        <Minus />
      </Button>
      <span aria-live="polite" className="w-9 text-center text-sm font-semibold text-white">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onIncrement}
        disabled={disabled || !canIncrement}
        aria-label="Agregar una unidad"
        className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
      >
        <Plus />
      </Button>
    </div>
  );
}
