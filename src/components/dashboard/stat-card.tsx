interface StatCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </span>
      <span
        className={`text-2xl font-semibold ${
          accent ? "text-[#3fbf1f]" : "text-zinc-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}