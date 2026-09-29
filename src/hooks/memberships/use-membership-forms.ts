import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  CreateMembershipFormValues,
  createMembershipSchema,
  RenewMembershipFormValues,
  renewMembershipSchema,
} from "@/common/schemas/membership.schema";
import { useCreateMembership, useRenewMembership } from "@/hooks/memberships/use-membership-mutations";
import { addOneMonth, todayInputValue } from "@/lib/utils/date";

// Crear la membresía de un usuario con su pago inicial
export function useCreateMembershipForm(userId: string, onSuccess?: () => void) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMembershipFormValues>({
    resolver: zodResolver(createMembershipSchema),
    defaultValues: { startDate: todayInputValue(), amount: "", notes: "" },
  });
  const { mutate, isPending } = useCreateMembership();
  const startDate = useWatch({ control, name: "startDate" });

  const onSubmit = handleSubmit(({ startDate, amount, notes }) =>
    mutate(
      { userId, data: { startDate, initialPayment: { amount: Number(amount), notes: notes || undefined } } },
      { onSuccess },
    ),
  );

  return {
    register,
    errors,
    onSubmit,
    isPending,
    coverage: startDate ? { from: startDate, until: addOneMonth(startDate) } : null,
  };
}

// Registrar un pago que extiende la membresía un mes
export function useRenewMembershipForm(userId: string, nextPaymentDate: string, onSuccess?: () => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenewMembershipFormValues>({
    resolver: zodResolver(renewMembershipSchema),
    defaultValues: { amount: "", notes: "" },
  });
  const { mutate, isPending } = useRenewMembership();

  // Igual que el backend: arranca en el próximo pago, o hoy si ya venció
  const next = new Date(nextPaymentDate);
  const validFrom = next > new Date() ? next : new Date();

  const onSubmit = handleSubmit(({ amount, notes }) =>
    mutate({ userId, data: { amount: Number(amount), notes: notes || undefined } }, { onSuccess }),
  );

  return {
    register,
    errors,
    onSubmit,
    isPending,
    coverage: { from: validFrom, until: addOneMonth(validFrom) },
  };
}
