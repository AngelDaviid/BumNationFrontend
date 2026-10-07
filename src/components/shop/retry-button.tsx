"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RetryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="h-10 px-5"
    >
      <RotateCw className={isPending ? "animate-spin" : undefined} /> Reintentar
    </Button>
  );
}
