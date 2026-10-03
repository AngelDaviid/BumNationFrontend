import {z} from "zod";

export const updateProductSchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/),
    stock: z.number(),
    brand: z.string(),
    categoryId: z.number(),
})

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;

export const createProductSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    description: z.string().nullable(),
    price: z.string()
        .regex(/^\d+(\.\d{1,2})?$/, "Ingresa un precio válido")
        .refine((value) => Number(value) > 0, "El precio debe ser mayor a 0"),
    stock: z.number({message: "Ingresa el stock"}).int().positive("El stock debe ser mayor a 0"),
    brand: z.string(),
    categoryId: z.number().positive("Selecciona una categoría"),
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
