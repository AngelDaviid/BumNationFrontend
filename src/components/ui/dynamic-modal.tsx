"use client";

import { useRef, useState, PointerEvent, ReactNode } from "react";
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

type MobileLayout = "center" | "floating" | "fullscreen" | "sheet";

const mobileLayoutClasses: Record<MobileLayout, string> = {
  center: "",
  floating:
    "max-sm:flex max-sm:flex-col max-sm:overflow-hidden max-sm:rounded-2xl max-sm:[&>[data-slot=dialog-close]]:z-30 max-sm:[&>[data-slot=dialog-close]]:bg-white",
  fullscreen:
    "max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:max-w-none max-sm:content-start max-sm:rounded-none",
  sheet:
    "max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:max-h-[85dvh] max-sm:rounded-none max-sm:rounded-t-2xl max-sm:data-open:zoom-in-100 max-sm:data-open:slide-in-from-bottom max-sm:data-closed:zoom-out-100 max-sm:data-closed:slide-out-to-bottom",
};

const mobileBodyClasses: Record<MobileLayout, string> = {
  center: "",
  floating: "max-sm:-mx-4 max-sm:-mb-4 max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-y-auto max-sm:px-4 max-sm:pb-4",
  fullscreen: "",
  sheet: "",
};

const DOUBLE_CLICK_WINDOW_MS = 500;

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
  hideHeader?: boolean;
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
  hideHeader = false,
}: ModalProps) {
  const layout = mobileLayout ?? (size === "xl" || size === "full" ? "fullscreen" : "center");
  const [internalOpen, setInternalOpen] = useState(false);
  const lastInsidePointerDown = useRef(0);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const close = () => setOpen(false);

  const handlePointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    lastInsidePointerDown.current = event.timeStamp;
  };

  const handleInteractOutside = (event: Event) => {
    const isFollowUpClick = event.timeStamp - lastInsidePointerDown.current < DOUBLE_CLICK_WINDOW_MS;
    if (!closeOnOutsideClick || isFollowUpClick) event.preventDefault();
  };

  const handleOpenAutoFocus = (event: Event) => {
    if (layout === "floating" && window.matchMedia("(max-width: 639px)").matches) event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("max-h-[90dvh] overflow-y-auto", sizeClasses[size], mobileLayoutClasses[layout], className)}
        onPointerDownCapture={handlePointerDownCapture}
        onInteractOutside={handleInteractOutside}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <DialogHeader className={cn(hideHeader && "sr-only")}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className={cn("min-w-0", mobileBodyClasses[layout])}>{typeof children === "function" ? children(close) : children}</div>
      </DialogContent>
    </Dialog>
  );
}