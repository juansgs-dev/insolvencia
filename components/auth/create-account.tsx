"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"

export function RegisterForm() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    nombre: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.nombre,
          phoneNumber: formData.phoneNumber || undefined,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la cuenta")
      }

      login(data.token, data.usuario)
      router.push("/")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      <Card className="shadow-xl border border-blue-100/40 backdrop-blur-xl bg-white/80 rounded-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold text-[#1e3a8a]">
            Crear Cuenta
          </CardTitle>
          <p className="text-gray-600 text-sm sm:text-base">
            Regístrate para comenzar
          </p>
        </CardHeader>

        <CardContent>
          <motion.form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <motion.div variants={fadeIn} className="space-y-2">
              <Label className="font-medium text-gray-700">Nombre</Label>
              <Input
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                maxLength={50}
                disabled={isLoading}
                className="rounded-xl border-gray-300 focus:ring-[#1e3a8a]"
              />
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-2">
              <Label className="font-medium text-gray-700">
                Teléfono (opcional)
              </Label>
              <Input
                type="tel"
                placeholder="+57 300 000 0000"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                maxLength={20}
                disabled={isLoading}
                className="rounded-xl border-gray-300 focus:ring-[#1e3a8a]"
              />
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-2">
              <Label className="font-medium text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                maxLength={50}
                disabled={isLoading}
                className="rounded-xl border-gray-300 focus:ring-[#1e3a8a]"
              />
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-2">
              <Label className="font-medium text-gray-700">Contraseña</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                maxLength={20}
                disabled={isLoading}
                className="rounded-xl border-gray-300 focus:ring-[#1e3a8a]"
              />
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-2">
              <Label className="font-medium text-gray-700">
                Confirmar Contraseña
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                maxLength={20}
                disabled={isLoading}
                className="rounded-xl border-gray-300 focus:ring-[#1e3a8a]"
              />
            </motion.div>

            <motion.div variants={fadeIn}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-lg rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </motion.div>

            <div className="pt-2 text-center text-sm">
              <Link
                href="/login"
                className="text-[#1e3a8a] hover:text-[#1e40af] font-medium transition"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
