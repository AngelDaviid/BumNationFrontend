"use client";

import { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import { type DropdownProps } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CalendarDropdown({ options = [], value, onChange, "aria-label": ariaLabel }: DropdownProps) {
  const current = options.find((option) => String(option.value) === String(value));

  function handleChange(next: string) {
    onChange?.({ target: { value: next } } as ChangeEvent<HTMLSelectElement>);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold capitalize text-zinc-800 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-[#6BFF3C]"
        >
          {current?.label}
          <ChevronDown className="size-3.5 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="max-h-64 min-w-28 overflow-y-auto">
        <DropdownMenuRadioGroup value={String(value)} onValueChange={handleChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={String(option.value)}
              disabled={option.disabled}
              className="cursor-pointer capitalize data-[state=checked]:bg-[#6BFF3C]/15 data-[state=checked]:font-semibold"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
