import { z } from "zod";
import { todayInputValue } from "@/lib/utils/date";

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
  paidAt: z
    .string()
    .min(1, "Elige la fecha del pago")
    .refine((value) => value <= todayInputValue(), "La fecha no puede ser posterior a hoy"),
  amount,
  notes: z.string().max(500).optional(),
});

export type CreateMembershipFormValues = z.infer<typeof createMembershipSchema>;
export type RenewMembershipFormValues = z.infer<typeof renewMembershipSchema>;
