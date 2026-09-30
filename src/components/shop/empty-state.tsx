import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-14 text-center sm:py-16">
      <Icon size={40} className="text-zinc-600" strokeWidth={1.5} />
      <p className="text-lg font-semibold text-white">{title}</p>
      {description && <p className="max-w-sm text-sm text-zinc-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
