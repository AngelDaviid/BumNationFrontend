"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  CreateMembershipFormValues,
  createMembershipSchema,
  RenewMembershipFormValues,
  renewMembershipSchema,
} from "@/common/schemas/membership.schema";
import { useCreateMembership, useRenewMembership } from "@/hooks/memberships/use-membership-mutations";
import { getApiErrorMessage } from "@/hooks/memberships/use-memberships";
import { addOneMonth, formatDate, todayInputValue } from "@/lib/utils/date";

const submitClass =
  "flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors";

export function CreateMembershipForm({ userId, onSuccess }: { userId: string; onSuccess?: () => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateMembershipFormValues>({
    resolver: zodResolver(createMembershipSchema),
    defaultValues: { startDate: todayInputValue(), amount: "", notes: "" },
  });
  const { mutate, isPending, error } = useCreateMembership();
  const startDate = useWatch({ control, name: "startDate" });

  const onSubmit = ({ startDate, amount, notes }: CreateMembershipFormValues) =>
    mutate(
      { userId, data: { startDate, initialPayment: { amount: Number(amount), notes: notes || undefined } } },
      { onSuccess },
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Fecha de inicio" error={errors.startDate?.message}>
        <Input type="date" registration={register("startDate")} />
      </Field>
      <Field label="Pago inicial (COP)" error={errors.amount?.message}>
        <Input type="text" inputMode="numeric" placeholder="Ej. 90000" registration={register("amount")} />
      </Field>
      <Field label="Notas (opcional)">
        <Input type="text" placeholder="Ej. Pago en efectivo" registration={register("notes")} />
      </Field>
      {startDate && (
        <p className="text-xs text-zinc-500">
          Cubre del {formatDate(startDate)} al {formatDate(addOneMonth(startDate))}.
        </p>
      )}
      {error && <p className="text-sm text-red-500">{getApiErrorMessage(error)}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className={submitClass}>
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Creando..." : "Crear membresía"}
        </Button>
      </div>
    </form>
  );
}

export function RenewMembershipForm({
  userId,
  nextPaymentDate,
  onSuccess,
}: {
  userId: string;
  nextPaymentDate: string;
  onSuccess?: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<RenewMembershipFormValues>({
    resolver: zodResolver(renewMembershipSchema),
    defaultValues: { amount: "", notes: "" },
  });
  const { mutate, isPending, error } = useRenewMembership();

  // Igual que el backend: arranca en el próximo pago, o hoy si ya venció
  const next = new Date(nextPaymentDate);
  const validFrom = next > new Date() ? next : new Date();

  const onSubmit = ({ amount, notes }: RenewMembershipFormValues) =>
    mutate({ userId, data: { amount: Number(amount), notes: notes || undefined } }, { onSuccess });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Valor pagado (COP)" error={errors.amount?.message}>
        <Input type="text" inputMode="numeric" placeholder="Ej. 90000" registration={register("amount")} />
      </Field>
      <Field label="Notas (opcional)">
        <Input type="text" placeholder="Ej. Pago en efectivo" registration={register("notes")} />
      </Field>
      <p className="text-xs text-zinc-500">
        Se extiende un mes: del {formatDate(validFrom)} al {formatDate(addOneMonth(validFrom))}.
      </p>
      {error && <p className="text-sm text-red-500">{getApiErrorMessage(error)}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className={submitClass}>
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Registrando..." : "Registrar pago"}
        </Button>
      </div>
    </form>
  );
}
