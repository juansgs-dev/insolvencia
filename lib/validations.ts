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
  nombre: z.string().min(2).max(50),
  email: z.string().email().max(50),
  password: z.string().min(6).max(20),
})

export type registerInput = z.infer<typeof registerSchema>


