import Image from "next/image";
import { cn } from "@/lib/utils/utils";

type LoaderSize = "sm" | "md" | "lg";
type LoaderTone = "dark" | "light";

const sizeClasses: Record<LoaderSize, string> = {
  sm: "size-4 border-2",
  md: "size-8 border-[3px]",
  lg: "size-12 border-4",
};

const trackClasses: Record<LoaderTone, string> = {
  dark: "border-zinc-700",
  light: "border-zinc-200",
};

const labelClasses: Record<LoaderTone, string> = {
  dark: "text-zinc-400",
  light: "text-zinc-500",
};

interface LoaderProps {
  size?: LoaderSize;
  tone?: LoaderTone;
  label?: string;
  className?: string;
}

export function Loader({ size = "md", tone = "dark", label, className }: LoaderProps) {
  return (
    <div role="status" className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          trackClasses[tone],

          "border-t-[#6BFF3C]",
        )}
      />
      {label ? (
        <span className={cn("text-sm font-medium", labelClasses[tone])}>{label}</span>
      ) : (
        <span className="sr-only">Cargando…</span>
      )}
    </div>
  );
}

interface LoadingScreenProps {
  label?: string;
  className?: string;
}

export function LoadingScreen({ label = "Cargando…", className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 bg-zinc-950",
        className,
      )}
    >
      <Image
        src="/Logo.svg"
        alt="Bum Nation"
        width={120}
        height={120}
        className="animate-pulse object-contain"
        priority
      />
      <Loader size="lg" label={label} />
    </div>
  );
}
