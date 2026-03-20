import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .max(50, "El correo no puede exceder 50 caracteres")
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .max(20, "La contraseña no puede exceder 20 caracteres"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email().max(50),
  password: z.string().min(8).max(20),
  phoneNumber: z
    .string()
    .regex(/^3\d{9}$/, "Número de celular colombiano inválido")
    .optional(),
})

export type registerInput = z.infer<typeof registerSchema>

export const advisorySchema = z.object({
  occupation: z
    .string()
    .min(3, "Debes indicar tu labor o profesion")
    .max(150, "La labor o profesion no puede exceder 150 caracteres"),
  hasAssets: z.boolean(),
  hasPayrollLoans: z.boolean(),
  creditorCount: z
    .number({ invalid_type_error: "Debes indicar el numero de acreedores" })
    .int("El numero de acreedores debe ser entero")
    .min(1, "Debes tener al menos un acreedor")
    .max(999, "El numero de acreedores no puede exceder 999"),
  delinquencyTime: z
    .string()
    .trim()
    .min(1, "Debes indicar el tiempo de mora")
    .max(100, "El tiempo de mora no puede exceder 100 caracteres"),
  hasEmbargoes: z.boolean(),
  totalDebtCapital: z
    .number({ invalid_type_error: "Debes indicar el capital total adeudado" })
    .positive("El capital total adeudado debe ser mayor a cero")
    .max(999999999999.99, "El valor excede el maximo permitido"),
  description: z.string().max(1000).optional(),
})

export type AdvisoryInput = z.infer<typeof advisorySchema>

