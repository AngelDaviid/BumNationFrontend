"use client"

import {ReactNode} from "react";
import {Button} from "@/components/ui/button";
import {Field} from "@/components/ui/field";
import {FormTitle} from "@/components/ui/form-title";
import {Input} from "@/components/ui/input";
import {Loader} from "@/components/ui/loader";
import {StatusBadge} from "@/components/membership/status-badge";
import {UserAvatarPicker} from "@/components/admin/users/user-avatar-picker";
import {useEditUserForm} from "@/hooks/users/use-edit-user-form";
import {User} from "@/types";

interface EditUserFormProps {
    user: User;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function OptionalLabel({children}: { children: ReactNode }) {
    return <>{children} <span className="font-normal text-zinc-400">(opcional)</span></>
}

function Section({title, children}: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
        </section>
    )
}

export function EditUserForm({user, onSuccess, onCancel}: EditUserFormProps) {
    const {
        register,
        errors,
        onSubmit,
        isPending,
        canSubmit,
        newImage,
        handleImageChange,
    } = useEditUserForm({user, onSuccess})

    const fullName = [user.firstName, user.middleName, user.firstLastName, user.secondLastName].filter(Boolean).join(" ");
    const initials = `${user.firstName?.[0] ?? ""}${user.firstLastName?.[0] ?? ""}`.toUpperCase();

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            <FormTitle title="Editar usuario" titleImage={{src: "/EditarUsuario.svg", width: 1200, height: 400}}/>
            <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-4">
                <UserAvatarPicker
                    imageUrl={user.imageUrl}
                    initials={initials}
                    file={newImage}
                    onChange={handleImageChange}
                    disabled={isPending}
                />
                <div className="flex min-w-0 flex-col gap-1">
                    <p className="truncate text-base font-semibold text-zinc-900">{fullName}</p>
                    <p className="truncate text-xs text-zinc-500">C.C. {user.identification}</p>
                    <div><StatusBadge status={user.gymMembership?.status ?? null}/></div>
                </div>
            </div>

            <Section title="Datos personales">
                <Field label="Primer nombre">
                    <Input type="text" error={errors.firstName?.message} registration={register("firstName")}/>
                </Field>
                <Field label={<OptionalLabel>Segundo nombre</OptionalLabel>}>
                    <Input type="text" error={errors.middleName?.message} registration={register("middleName")}/>
                </Field>
                <Field label="Primer apellido">
                    <Input type="text" error={errors.firstLastName?.message} registration={register("firstLastName")}/>
                </Field>
                <Field label={<OptionalLabel>Segundo apellido</OptionalLabel>}>
                    <Input type="text" error={errors.secondLastName?.message} registration={register("secondLastName")}/>
                </Field>
            </Section>

            <Section title="Contacto">
                <Field label="Identificación">
                    <Input type="text" inputMode="numeric" error={errors.identification?.message} registration={register("identification")}/>
                </Field>
                <Field label="Teléfono">
                    <Input type="tel" inputMode="tel" error={errors.phone?.message} registration={register("phone")}/>
                </Field>
                <div className="sm:col-span-2">
                    <Field label="Correo electrónico">
                        <Input type="email" inputMode="email" error={errors.email?.message} registration={register("email")}/>
                    </Field>
                </div>
            </Section>

            <div className="sticky -bottom-4 -mx-4 flex justify-end gap-2 border-t border-zinc-100 bg-white px-4 py-3">
                <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={isPending}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit}
                    className="gap-2"
                >
                    {isPending && <Loader size="sm"/>}
                    {isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
            </div>
        </form>
    )
}
