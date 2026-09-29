import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  CreateMembershipFormValues,
  createMembershipSchema,
} from "@/common/schemas/membership.schema";
import { useCreateMembership } from "@/hooks/memberships/use-membership-mutations";
import { addOneMonth, todayInputValue } from "@/lib/utils/date";

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


