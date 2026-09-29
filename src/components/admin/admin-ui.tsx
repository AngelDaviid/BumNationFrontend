'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { MembershipStatus, OrderStatus, PaginatedResponse } from '@/types';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0 rounded-xl border border-zinc-800 bg-zinc-900', className)}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'warning' | 'danger';
}) {
  const toneClass = {
    default: 'text-[#6BFF3C]',
    warning: 'text-amber-400',
    danger: 'text-red-400',
  }[tone];

  return (
    <Panel className="p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={cn('mt-2 text-3xl font-bold', toneClass)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </Panel>
  );
}

export function PrimaryButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'bg-[#6BFF3C] font-semibold text-black hover:bg-[#5de52f] disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}

export function SecondaryButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn(
        'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white',
        className,
      )}
      {...props}
    />
  );
}

export function DangerButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn('text-red-400 hover:bg-red-500/10 hover:text-red-300', className)}
      {...props}
    />
  );
}

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-10 text-sm text-zinc-400">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {message}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="p-10 text-center text-sm text-zinc-500">{children}</p>;
}

// Tabla con estilos del panel; el contenido se pasa como <thead>/<tbody>
export function DataTable({ children, compact }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'w-full text-left text-sm text-zinc-300 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-zinc-500 [&_tbody_tr]:border-t [&_tbody_tr]:border-zinc-800 [&_tbody_tr:hover]:bg-zinc-800/40',
          !compact && 'min-w-[640px]',
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function Pagination<T>({
  meta,
  onPageChange,
}: {
  meta: PaginatedResponse<T>['meta'] | undefined;
  onPageChange: (page: number) => void;
}) {
  if (!meta || meta.totalPage <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3 text-sm text-zinc-400">
      <span>
        Página {meta.page} de {meta.totalPage} · {meta.total} registros
      </span>
      <div className="flex gap-2">
        <SecondaryButton
          size="sm"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft /> Anterior
        </SecondaryButton>
        <SecondaryButton
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Siguiente <ChevronRight />
        </SecondaryButton>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-shadow focus:ring-2 focus:ring-[#6BFF3C]';

export function TextField({
  label,
  className,
  ...props
}: React.ComponentProps<'input'> & { label: string }) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <input className={inputClass} {...props} />
    </label>
  );
}

export function TextAreaField({
  label,
  className,
  ...props
}: React.ComponentProps<'textarea'> & { label: string }) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <textarea className={cn(inputClass, 'min-h-20')} {...props} />
    </label>
  );
}

export function SelectField({
  label,
  options,
  className,
  ...props
}: React.ComponentProps<'select'> & {
  label?: string;
  options: { value: string; label: string }[];
}) {
  const select = (
    <select className={cn(inputClass, !label && className)} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  if (!label) return select;
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      {select}
    </label>
  );
}

// Panel lateral para formularios y detalles
export function AdminSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          'w-full overflow-y-auto border-zinc-800 bg-zinc-900 text-white',
          wide ? 'data-[side=right]:sm:max-w-2xl' : 'data-[side=right]:sm:max-w-md',
        )}
      >
        <SheetHeader>
          <SheetTitle className="text-white">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-zinc-400">{description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

type Tone = 'green' | 'amber' | 'red' | 'blue' | 'zinc' | 'violet';

const toneClasses: Record<Tone, string> = {
  green: 'bg-[#6BFF3C]/15 text-[#6BFF3C]',
  amber: 'bg-amber-400/15 text-amber-300',
  red: 'bg-red-500/15 text-red-300',
  blue: 'bg-sky-400/15 text-sky-300',
  violet: 'bg-violet-400/15 text-violet-300',
  zinc: 'bg-zinc-700/50 text-zinc-300',
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'Por confirmar',
  CONFIRMED: 'Confirmada',
  AWAITING_PAYMENT: 'Esperando pago',
  PAID: 'Pagada',
  SHIPPED: 'Enviada',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
};

const ORDER_STATUS_TONES: Record<OrderStatus, Tone> = {
  PENDING_CONFIRMATION: 'amber',
  CONFIRMED: 'blue',
  AWAITING_PAYMENT: 'amber',
  PAID: 'violet',
  SHIPPED: 'blue',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  return <Pill tone={ORDER_STATUS_TONES[status]}>{ORDER_STATUS_LABELS[status]}</Pill>;
}

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  ACTIVE: 'Activa',
  EXPIRED: 'Vencida',
  SUSPENDED: 'Suspendida',
  CANCELLED: 'Cancelada',
};

const MEMBERSHIP_STATUS_TONES: Record<MembershipStatus, Tone> = {
  ACTIVE: 'green',
  EXPIRED: 'red',
  SUSPENDED: 'amber',
  CANCELLED: 'zinc',
};

export function MembershipStatusPill({
  status,
  isExpired,
  isAboutToExpire,
}: {
  status: MembershipStatus;
  isExpired?: boolean;
  isAboutToExpire?: boolean;
}) {
  // El backend no pasa la membresía a EXPIRED automáticamente, así que lo deducimos de la fecha
  if (status === 'ACTIVE' && isExpired) return <Pill tone="red">Vencida</Pill>;
  if (status === 'ACTIVE' && isAboutToExpire) return <Pill tone="amber">Por vencer</Pill>;
  return (
    <Pill tone={MEMBERSHIP_STATUS_TONES[status]}>{MEMBERSHIP_STATUS_LABELS[status]}</Pill>
  );
}
