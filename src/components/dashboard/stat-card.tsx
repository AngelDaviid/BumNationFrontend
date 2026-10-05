import {Loader} from "@/components/ui/loader";

interface StatCardProps {
  label: string;
  value: string | number ;
  accent?: boolean;
  isLoading?: boolean;
}

export function StatCard({ label, value, accent, isLoading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col items-center justify-center gap-1">
      <span className="text-center text-[11px] font-medium uppercase tracking-wide text-zinc-400 sm:text-xs">
        {label}
      </span>
      <span
        className={`text-2xl font-semibold ${
          accent ? "text-[#3fbf1f]" : "text-zinc-800"
        }`}
      >
        {isLoading ?<Loader size={"sm"} tone={"dark"} /> :value}
      </span>
    </div>
  );
}