import { z } from "zod";

const amount = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Ingresa un valor válido")
  .refine((value) => Number(value) > 0, "El valor debe ser mayor a 0");

export const createMembershipSchema = z.object({
  startDate: z.string().min(1, "Elige la fecha de inicio"),
  amount,
  notes: z.string().max(500).optional(),
});

export const renewMembershipSchema = z.object({
  amount,
  notes: z.string().max(500).optional(),
});

export type CreateMembershipFormValues = z.infer<typeof createMembershipSchema>;
export type RenewMembershipFormValues = z.infer<typeof renewMembershipSchema>;
