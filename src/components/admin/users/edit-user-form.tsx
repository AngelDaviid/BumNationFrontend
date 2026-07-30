import { UpdateUserFormValues, updateUserSchema } from "@/common/schemas/user.schema";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormCard } from "@/components/ui/form-card";
import { FormTitle } from "@/components/ui/form-title";
import { FormGrid } from "@/components/ui/from-grid";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "@/hooks/users/use-update-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


interface EditUserFormProps {
    userId: string;
    defaultValues: UpdateUserFormValues;
    imageUrl?: string | null;
    onSuccess?: () => void;
}

export function EditUserForm({ userId, defaultValues, imageUrl, onSuccess }: EditUserFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues,
    })

    const { mutate: updateUser, isPending, isError, error } = useUpdateUser()
    //const { mutate: uploadImage, isPending: isUploadingImage } = useUploadUserImage();

    const onSubmit = (data: UpdateUserFormValues) => {
        updateUser(
            { id: userId, data },
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            }
        );
    };

    /** const handleImageChange = (file: File | null) => {
        if (!file) return;

        uploadImage(
            { id: userId, file },
            {
                onError: () => {
                    toast.error("No se puede subir la imagen")
                }
            }
        )
    } **/

    return (
        <FormCard
            onSubmit={handleSubmit(onSubmit)}
            error={isError ? (error as Error).message : undefined}
            header={<FormTitle title="Actualizar usuario" />}
            maxWidth="2xl"
        >
            {/** <div className="flex justify-center mb-6">
                <ImageUpload
                    value={imageUrl}
                    onChange={handleImageChange}
                    isUploading={isUploadingImage}
                    shape="circle"
                />
            </div> **/}
            <FormGrid columns={2}>
                <Field label="identificación">
                    <Input
                        type="text"
                        error={errors.identification?.message}
                        placeholder="Ingresa la identificación del usuario"
                        registration={register('identification')}
                    />
                </Field>
                <Field label="email">
                    <Input
                        type="text"
                        error={errors.email?.message}
                        placeholder="Ingresa el email del usuario"
                        registration={register('email')}
                    />
                </Field>
                <Field label="Nombre">
                    <Input
                        type="text"
                        error={errors.firstName?.message}
                        placeholder="Ingresa el nombre del usuario"
                        registration={register('firstName')}
                    />
                </Field>
                <Field label="Segundo Nombre (opcional)">
                    <Input
                        type="text"
                        error={errors.middleName?.message}
                        placeholder="Ingresa el segundo nombre del usuario"
                        registration={register('middleName')}
                    />
                </Field>
                <Field label="Primer Apellido">
                    <Input
                        type="text"
                        error={errors.firstLastName?.message}
                        placeholder="Ingresa el primer apellido del usuario"
                        registration={register('firstLastName')}
                    />
                </Field>
                <Field label="Segundo Apellido (opcional)">
                    <Input
                        type="text"
                        error={errors.secondLastName?.message}
                        placeholder="Ingresa el segundo apellido del usuario"
                        registration={register('secondLastName')}
                    />
                </Field>
                <Field label="Teléfono">
                    <Input
                        type="text"
                        error={errors.phone?.message}
                        placeholder="Ingresa el teléfono del usuario"
                        registration={register('phone')}
                    />
                </Field>
            </FormGrid>

            <div className="flex justify-end mt-4">
                <Button type="submit" size="lg" disabled={!isDirty || isPending} className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors">
                    Actualizar
                </Button>
            </div>

        </FormCard>
    )
}