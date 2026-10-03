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
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalSize;      
  className?: string;
  closeOnOutsideClick?: boolean;
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
}: ModalProps) {
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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(sizeClasses[size], className)}
        onInteractOutside={handleInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {typeof children === "function" ? children(close) : children}
      </DialogContent>
    </Dialog>
  );
}