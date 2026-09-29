import {Controller} from "react-hook-form";
import {Field} from "@/components/ui/field";
import {DatePicker} from "@/components/ui/date-picker";
import {Input} from "@/components/ui/input";
import {formatDate} from "@/lib/utils/date";
import {Button} from "@/components/ui/button";
import {Loader} from "@/components/ui/loader";
import {useRenewMembershipForm} from "@/hooks/memberships/use-renew-membership-form";


const submitClass =
    "flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors";


export function RenewMembershipForm({
  userId,
  nextPaymentDate,
  onSuccess,
}: {
    userId: string;
    nextPaymentDate: string;
    onSuccess?: () => void;
}) {
    const {register, control, errors, onSubmit, isPending, coverage} = useRenewMembershipForm(userId, nextPaymentDate, onSuccess);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field label="Fecha del pago">
                <Controller
                    control={control}
                    name="paidAt"
                    render={({field}) => (
                        <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            maxDate={new Date()}
                            error={errors.paidAt?.message}
                        />
                    )}
                />
            </Field>
            <Field label="Valor pagado (COP)" error={errors.amount?.message}>
                <Input type="text" inputMode="numeric" placeholder="Ej. 90000" registration={register("amount")}/>
            </Field>
            <Field label="Notas (opcional)">
                <Input type="text" placeholder="Ej. Pago en efectivo" registration={register("notes")}/>
            </Field>
            <p className="text-xs text-zinc-500">
                Se extiende un mes: del {formatDate(coverage.from)} al {formatDate(coverage.until)}.
            </p>
            <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className={submitClass}>
                    {isPending && <Loader size="sm"/>}
                    {isPending ? "Registrando..." : "Registrar pago"}
                </Button>
            </div>
        </form>
    );
}