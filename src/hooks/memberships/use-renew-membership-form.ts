import {useForm, useWatch} from "react-hook-form";
import {RenewMembershipFormValues, renewMembershipSchema} from "@/common/schemas/membership.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRenewMembership} from "@/hooks/memberships/use-membership-mutations";
import {addOneMonth, todayInputValue} from "@/lib/utils/date";

export function useRenewMembershipForm(userId: string, nextPaymentDate: string, onSuccess?: () => void) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RenewMembershipFormValues>({
        resolver: zodResolver(renewMembershipSchema),
        defaultValues: { paidAt: todayInputValue(), amount: "", notes: "" },
    });
    const { mutate, isPending } = useRenewMembership();

    const paidAt = useWatch({ control, name: "paidAt" });

    const next = new Date(nextPaymentDate);
    const paidDate = paidAt ? new Date(paidAt) : new Date();
    const validFrom = next > paidDate ? next : paidDate;

    const onSubmit = handleSubmit(({ paidAt, amount, notes }) =>
        mutate({ userId, data: { paidAt, amount: Number(amount), notes: notes || undefined } }, { onSuccess }),
    );

    return {
        register,
        control,
        errors,
        onSubmit,
        isPending,
        coverage: { from: validFrom, until: addOneMonth(validFrom) },
    };
}