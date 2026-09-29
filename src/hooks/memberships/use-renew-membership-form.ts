import {useForm} from "react-hook-form";
import {RenewMembershipFormValues, renewMembershipSchema} from "@/common/schemas/membership.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRenewMembership} from "@/hooks/memberships/use-membership-mutations";
import {addOneMonth} from "@/lib/utils/date";

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