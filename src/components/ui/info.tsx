export function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs text-zinc-400">{label}</p>
            <div className="mt-0.5 text-zinc-800">{value}</div>
        </div>
    );
}