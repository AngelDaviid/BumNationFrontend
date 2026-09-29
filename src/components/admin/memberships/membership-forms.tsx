"use client";

import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateMembershipForm } from "@/hooks/memberships/use-create-membership-form";
import { formatDate } from "@/lib/utils/date";

const submitClass =
  "flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors";

export function CreateMembershipForm({ userId, onSuccess }: { userId: string; onSuccess?: () => void }) {
  const { register, errors, onSubmit, isPending, coverage } = useCreateMembershipForm(userId, onSuccess);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Fecha de inicio" error={errors.startDate?.message}>
        <Input type="date" registration={register("startDate")} />
      </Field>
      <Field label="Pago inicial (COP)" error={errors.amount?.message}>
        <Input type="text" inputMode="numeric" placeholder="Ej. 90000" registration={register("amount")} />
      </Field>
      <Field label="Notas (opcional)">
        <Input type="text" placeholder="Ej. Pago en efectivo" registration={register("notes")} />
      </Field>
      {coverage && (
        <p className="text-xs text-zinc-500">
          Cubre del {formatDate(coverage.from)} al {formatDate(coverage.until)}.
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className={submitClass}>
          {isPending && <Loader size="sm" />}
          {isPending ? "Creando..." : "Crear membresía"}
        </Button>
      </div>
    </form>
  );
}
