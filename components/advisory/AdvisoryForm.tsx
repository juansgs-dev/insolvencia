"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AdvisoryForm() {
  const [loading, setLoading] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setSuccess(false)

    if (!file || !documentType) {
      setError("Por favor selecciona un archivo y el tipo de documento.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("documentType", documentType)
      formData.append("description", description)

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Error al subir el documento")
      } else {
        setSuccess(true)
        setFile(null)
        setDocumentType("")
        setDescription("")
      }
    } catch (err) {
      console.error(err)
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const url = "/FORMATO_INFORMACIÓN_PARA_SOLICITUD_DE_INSOLVENCIA_JA.docx"
    const link = document.createElement("a")
    link.href = url
    link.download = "FORMATO_INFORMACIÓN_PARA_SOLICITUD_DE_INSOLVENCIA_JA.docx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="shadow-xl border border-blue-100/40 bg-white/80 backdrop-blur-xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-[#1e3a8a]">
          Solicitar asesoría
        </CardTitle>
        <p className="text-sm text-gray-600">
          Sube los documentos requeridos para tu proceso de insolvencia
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de documento</Label>
          <select
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option value="">Selecciona el tipo de documento</option>
            <option value="financial_statement">Estado financiero</option>
            <option value="bank_certificate">Certificado bancario</option>
            <option value="identity_document">Documento de identidad</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Archivo del documento</Label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div className="space-y-2">
          <Label>Descripción (opcional)</Label>
          <Textarea
            placeholder="Información adicional sobre el documento..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">Documento subido correctamente!</p>}

        <div className="flex flex-col md:flex-row gap-2">
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af]"
          >
            {loading ? "Subiendo..." : "Enviar documentos"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1 rounded-xl border border-gray-400 hover:bg-gray-100"
          >
            Descargar formato de solicitud
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
