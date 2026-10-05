"use client";

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {cn} from "@/lib/utils/utils";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

type MobileLayout = "center" | "fullscreen" | "sheet";

const mobileLayoutClasses: Record<MobileLayout, string> = {
  center: "",
  fullscreen:
    "max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:max-w-none max-sm:content-start max-sm:rounded-none",
  sheet:
    "max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:max-h-[85dvh] max-sm:rounded-none max-sm:rounded-t-2xl max-sm:data-open:zoom-in-100 max-sm:data-open:slide-in-from-bottom max-sm:data-closed:zoom-out-100 max-sm:data-closed:slide-out-to-bottom",
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-4xl",
};

interface ModalProps {
  title: string;
  description?: string;
  trigger?: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalSize;      
  className?: string;
  closeOnOutsideClick?: boolean;
  mobileLayout?: MobileLayout;
}

export function DynamicModal({
  title,
  description,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  size = "md",
  className,
  closeOnOutsideClick = false,
  mobileLayout,
}: ModalProps) {
  const layout = mobileLayout ?? (size === "xl" || size === "full" ? "fullscreen" : "center");
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const close = () => setOpen(false);

  const handleInteractOutside = (event: Event) => {
    if (!closeOnOutsideClick) event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("max-h-[90dvh] overflow-y-auto", sizeClasses[size], mobileLayoutClasses[layout], className)}
        onInteractOutside={handleInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-w-0">{typeof children === "function" ? children(close) : children}</div>
      </DialogContent>
    </Dialog>
  );
}