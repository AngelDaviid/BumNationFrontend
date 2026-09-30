"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDropdown } from "@/components/ui/calendar-dropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";

interface DatePickerProps {
  // Fecha en formato YYYY-MM-DD, igual que un input type="date"
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maxDate?: Date;
}

function toDate(value?: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function DatePicker({ value, onChange, placeholder = "Selecciona una fecha", error, disabled, maxDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-lg bg-zinc-100 px-3.5 py-2.5 text-left text-sm outline-none transition-shadow focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
              error ? "ring-1 ring-red-400 focus:ring-red-400" : "focus:ring-[#6BFF3C]",
              selected ? "text-zinc-800" : "text-zinc-400",
            )}
          >
            {selected ? format(selected, "d 'de' MMMM, yyyy", { locale: es }) : placeholder}
            <CalendarIcon className="size-4 text-zinc-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-lg ring-0 [--primary:#6BFF3C] [--primary-foreground:#0b2e04]">
          <Calendar
            mode="single"
            locale={es}
            selected={selected}
            defaultMonth={selected}
            disabled={maxDate ? { after: maxDate } : undefined}
            endMonth={maxDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            className="bg-white"
            components={{ Dropdown: CalendarDropdown }}
            classNames={{
              caption_label: "flex items-center gap-1 text-sm font-semibold capitalize text-zinc-800",
              weekday: "flex-1 text-[0.75rem] font-medium uppercase text-zinc-400 select-none",
              today: "rounded-md ring-1 ring-[#6BFF3C] ring-inset text-zinc-900",
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
