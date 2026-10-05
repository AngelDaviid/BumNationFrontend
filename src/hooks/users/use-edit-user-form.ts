import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpdateUserFormValues, updateUserSchema} from "@/common/schemas/user.schema";
import {useUpdateUser} from "@/hooks/users/use-update-user";
import {useUploadUserImage} from "@/hooks/users/use-upload-user-image";
import {User} from "@/types";

export function toUserFormValues(user: User): UpdateUserFormValues {
    return {
        identification: user.identification,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName ?? "",
        firstLastName: user.firstLastName,
        secondLastName: user.secondLastName ?? "",
        phone: user.phone ?? "",
    };
}

interface UseEditUserFormProps {
    user: User;
    onSuccess?: () => void;
}

export function useEditUserForm({user, onSuccess}: UseEditUserFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isDirty},
    } = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: toUserFormValues(user),
    })

    const [newImage, setNewImage] = useState<File | null>(null)

    const updateUser = useUpdateUser()
    const uploadImage = useUploadUserImage()

    const isPending = updateUser.isPending || uploadImage.isPending

    const onSubmit = handleSubmit(async (data) => {
        try {
            let updatedUser: User | null = null

            if (isDirty) {
                updatedUser = await updateUser.mutateAsync({id: user.id, data})
            }

            if (newImage) {
                updatedUser = await uploadImage.mutateAsync({id: user.id, file: newImage})
            }

            if (updatedUser) {
                reset(toUserFormValues(updatedUser))
            }
            setNewImage(null)
            onSuccess?.()
        } catch {
        }
    });

    return {
        register,
        errors,
        onSubmit,
        isPending,
        canSubmit: (isDirty || newImage !== null) && !isPending,
        newImage,
        handleImageChange: setNewImage,
    };
}
