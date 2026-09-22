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