"use client"

import { useState, type ChangeEvent } from "react"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

function formatColombianThousands(value: string) {
  const digitsOnly = value.replace(/\D/g, "")
  if (!digitsOnly) return ""
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function AdvisoryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      occupation: "",
      hasAssets: "",
      hasPayrollLoans: "",
      creditorCount: "",
      delinquencyTime: "",
      hasEmbargoes: "",
      totalDebtCapital: "",
      description: "",
      file: null as File | null,
    },
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.occupation.trim()) {
        errors.occupation = "Debes indicar tu labor o profesion"
      }
      if (!values.hasAssets) {
        errors.hasAssets = "Selecciona una opcion"
      }
      if (!values.hasPayrollLoans) {
        errors.hasPayrollLoans = "Selecciona una opcion"
      }

      const creditorCount = Number(values.creditorCount)
      if (!values.creditorCount) {
        errors.creditorCount = "Debes indicar la cantidad de acreedores"
      } else if (!Number.isInteger(creditorCount) || creditorCount < 1) {
        errors.creditorCount = "Debe ser un numero entero mayor o igual a 1"
      }

      if (!values.delinquencyTime.trim()) {
        errors.delinquencyTime = "Debes indicar el tiempo de mora"
      }
      if (!values.hasEmbargoes) {
        errors.hasEmbargoes = "Selecciona una opcion"
      }

      const totalDebtDigits = values.totalDebtCapital.replace(/\./g, "")
      const totalDebtCapital = Number(totalDebtDigits)
      if (!totalDebtDigits) {
        errors.totalDebtCapital = "Debes indicar el total del capital adeudado"
      } else if (Number.isNaN(totalDebtCapital) || totalDebtCapital <= 0) {
        errors.totalDebtCapital = "Debe ser un valor mayor a 0"
      }

      if (!values.file) {
        errors.file = "Debes adjuntar la ultima colilla de pago"
      }

      return errors
    },
    onSubmit: async (values, { resetForm, setStatus }) => {
      setStatus(undefined)
      setLoading(true)

      try {
        const formData = new FormData()
        formData.append("file", values.file as File)
        formData.append("documentType", "last_pay_stub")
        formData.append("occupation", values.occupation.trim())
        formData.append("hasAssets", String(values.hasAssets === "si"))
        formData.append("hasPayrollLoans", String(values.hasPayrollLoans === "si"))
        formData.append("creditorCount", values.creditorCount)
        formData.append("delinquencyTime", values.delinquencyTime.trim())
        formData.append("hasEmbargoes", String(values.hasEmbargoes === "si"))
        formData.append("totalDebtCapital", values.totalDebtCapital.replace(/\./g, ""))
        formData.append("description", values.description.trim())

        const res = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setStatus(data.message || "Error al enviar la solicitud")
          return
        }

        toast.success("Solicitud enviada correctamente")
        resetForm()
        router.push("/")
      } catch {
        setStatus("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    },
  })
  const handleFieldChange =
    (field: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      formik.setFieldValue(field, e.target.value, true)
    }

  return (
    <Card className="shadow-xl border border-blue-100/40 bg-white/80 backdrop-blur-xl rounded-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-[#1e3a8a]">
          Solicitar asesoría
        </CardTitle>
        <p className="text-sm text-gray-600">Completa el formulario para evaluar tu caso</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="occupation">¿A qué te dedicas? (labor o profesión)</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formik.values.occupation}
              onChange={handleFieldChange("occupation")}
              onBlur={formik.handleBlur}
            />
            {formik.touched.occupation && formik.errors.occupation && (
              <p className="text-sm text-red-500">{formik.errors.occupation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>¿Tienes propiedades o bienes a tu nombre?</Label>
            <select
              name="hasAssets"
              className="w-full rounded-xl border border-gray-300 px-3 py-2"
              value={formik.values.hasAssets}
              onChange={handleFieldChange("hasAssets")}
              onBlur={formik.handleBlur}
            >
              <option value="">Selecciona una opción</option>
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>
            {formik.touched.hasAssets && formik.errors.hasAssets && (
              <p className="text-sm text-red-500">{formik.errors.hasAssets}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>¿Tienes créditos por libranza o con descuento directo de nómina?</Label>
            <select
              name="hasPayrollLoans"
              className="w-full rounded-xl border border-gray-300 px-3 py-2"
              value={formik.values.hasPayrollLoans}
              onChange={handleFieldChange("hasPayrollLoans")}
              onBlur={formik.handleBlur}
            >
              <option value="">Selecciona una opción</option>
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>
            {formik.touched.hasPayrollLoans && formik.errors.hasPayrollLoans && (
              <p className="text-sm text-red-500">{formik.errors.hasPayrollLoans}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditorCount">
              ¿A cuántos acreedores les debes? (Bancos, cooperativas, entidades públicas, almacenes, personas naturales, etc.)
            </Label>
            <Input
              id="creditorCount"
              name="creditorCount"
              type="number"
              min={1}
              value={formik.values.creditorCount}
              onChange={handleFieldChange("creditorCount")}
              onBlur={formik.handleBlur}
            />
            {formik.touched.creditorCount && formik.errors.creditorCount && (
              <p className="text-sm text-red-500">{formik.errors.creditorCount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delinquencyTime">
              ¿Qué tiempo de mora tienes con tus obligaciones (meses)?
            </Label>
            <Input
              id="delinquencyTime"
              name="delinquencyTime"
              value={formik.values.delinquencyTime}
              onChange={handleFieldChange("delinquencyTime")}
              onBlur={formik.handleBlur}
            />
            {formik.touched.delinquencyTime && formik.errors.delinquencyTime && (
              <p className="text-sm text-red-500">{formik.errors.delinquencyTime}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>¿Tienes embargos actualmente?</Label>
            <select
              name="hasEmbargoes"
              className="w-full rounded-xl border border-gray-300 px-3 py-2"
              value={formik.values.hasEmbargoes}
              onChange={handleFieldChange("hasEmbargoes")}
              onBlur={formik.handleBlur}
            >
              <option value="">Selecciona una opción</option>
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>
            {formik.touched.hasEmbargoes && formik.errors.hasEmbargoes && (
              <p className="text-sm text-red-500">{formik.errors.hasEmbargoes}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalDebtCapital">
              ¿Cuánto suman en total sus deudas? (Sólo capital, sin intereses)
            </Label>
            <Input
              id="totalDebtCapital"
              name="totalDebtCapital"
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
              value={formik.values.totalDebtCapital}
              onChange={(e) => {
                formik.setFieldValue(
                  "totalDebtCapital",
                  formatColombianThousands(e.target.value),
                  true
                )
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.totalDebtCapital && formik.errors.totalDebtCapital && (
              <p className="text-sm text-red-500">{formik.errors.totalDebtCapital}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">
              Adjuntar 📝 Por favor, aportar su último desprendible de la colilla de pago.
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              onChange={(e) => {
                const selectedFile = e.currentTarget.files?.[0] || null
                formik.setFieldValue("file", selectedFile, true)
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.file && formik.errors.file && (
              <p className="text-sm text-red-500">{formik.errors.file}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Observaciones (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Agrega información adicional si aplica"
              value={formik.values.description}
              onChange={handleFieldChange("description")}
              onBlur={formik.handleBlur}
            />
          </div>

          {formik.status && <p className="text-red-500 font-medium">{formik.status}</p>}

          <div className="flex flex-col md:flex-row gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af]"
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Volver al inicio
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
