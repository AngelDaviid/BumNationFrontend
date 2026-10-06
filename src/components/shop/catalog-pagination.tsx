import Link from "next/link";
import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const outlineButton =
  "h-10 border-zinc-300 bg-transparent px-4 text-zinc-700 hover:border-brand hover:bg-transparent hover:text-brand-text";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  pageHref: (page: number) => string;
}

export function CatalogPagination({ page, totalPages, pageHref }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2 sm:gap-4">
      <PageLink href={pageHref(page - 1)} disabled={page <= 1} label="Página anterior">
        <ChevronLeft />
        <span className="hidden sm:inline">Anterior</span>
      </PageLink>
      <span className="text-sm text-zinc-700">
        Página <span className="font-semibold text-zinc-900">{page}</span> de {totalPages}
      </span>
      <PageLink href={pageHref(page + 1)} disabled={page >= totalPages} label="Página siguiente">
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: ReactNode }) {
  if (disabled) {
    return (
      <Button variant="outline" disabled aria-label={label} className={outlineButton}>
        {children}
      </Button>
    );
  }
  return (
    <Button asChild variant="outline" className={outlineButton}>
      <Link href={href} scroll={false} aria-label={label}>
        {children}
      </Link>
    </Button>
  );
}
