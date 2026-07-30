import {z} from "zod";

export const updateUserSchema = z.object({
    identification: z.string().min(1, 'La identificación es requerida').optional(),
    email: z.string().email({message: "El correo electrónico no es válido"}).optional(),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    middleName: z.string().optional(),
    firstLastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
    secondLastName: z.string().optional(),
    phone: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres').nullable().optional(),
    imageUrl: z.string().url({message: "La URL de la imagen no es válida"}).nullable().optional(),
    role: z.enum(["user", "admin"]).optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;