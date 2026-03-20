"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ArrowLeft, FileText } from "lucide-react"
import { downloadDocument } from "@/lib/utils/downloadDocument"

type DocumentModel = {
  id: string
  documentType: string
  fileType: string
  fileUrl: string
  description: string | null
  occupation: string
  hasAssets: boolean
  hasPayrollLoans: boolean
  creditorCount: number
  delinquencyTime: string
  hasEmbargoes: boolean
  totalDebtCapital: string
  createdAt: string
  user: {
    fullName: string | null
    email: string
  }
}

function getFileLabel(type: string) {
  if (type === "application/pdf") return "PDF"
  if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "DOCX"
  return "OTRO"
}

function formatCurrencyCop(value: string | number) {
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return "No disponible"
  return new Intl.NumberFormat("es-CO").format(numericValue)
}

function yesNoLabel(value: boolean) {
  return value ? "Si" : "No"
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 rounded-lg border p-3 sm:grid-cols-[220px_1fr] sm:gap-3">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-sm text-slate-900">{value}</p>
    </div>
  )
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentModel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<DocumentModel | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/admin/documents")
      .then(res => res.json())
      .then(data => setDocuments(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="flex justify-center px-6 py-10">
      <Card className="w-full max-w-6xl rounded-2xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-[#1e3a8a] flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Documentos cargados
          </CardTitle>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-center">Archivo</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {documents.map(doc => (
                  <TableRow
                    key={doc.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <TableCell className="font-medium">
                      {doc.user.fullName ?? "—"}
                    </TableCell>
                    <TableCell>{doc.user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {getFileLabel(doc.fileType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          downloadDocument(doc.fileUrl)
                        }}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Descargar
                      </button>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={selectedDocument !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDocument(null)
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-[#1e3a8a]">
                  Detalle de solicitud de asesoria
                </DialogTitle>
                <DialogDescription>
                  {selectedDocument.user.fullName ?? "Usuario"} - {selectedDocument.user.email}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <DetailRow
                  label="Fecha de solicitud"
                  value={new Date(selectedDocument.createdAt).toLocaleString("es-CO")}
                />
                <DetailRow
                  label="Documento adjunto"
                  value={`Tipo: ${getFileLabel(selectedDocument.fileType)} (${selectedDocument.documentType})`}
                />
                <DetailRow
                  label="¿A qué te dedicas? (labor o profesion)"
                  value={selectedDocument.occupation}
                />
                <DetailRow
                  label="¿Tienes propiedades o bienes a tu nombre?"
                  value={yesNoLabel(selectedDocument.hasAssets)}
                />
                <DetailRow
                  label="¿Tienes creditos por libranza o con descuento directo de nomina?"
                  value={yesNoLabel(selectedDocument.hasPayrollLoans)}
                />
                <DetailRow
                  label="¿A cuantos acreedores les debes?"
                  value={String(selectedDocument.creditorCount)}
                />
                <DetailRow
                  label="¿Que tiempo de mora tienes con tus obligaciones?"
                  value={selectedDocument.delinquencyTime}
                />
                <DetailRow
                  label="¿Tienes embargos actualmente?"
                  value={yesNoLabel(selectedDocument.hasEmbargoes)}
                />
                <DetailRow
                  label="Total de deudas (solo capital)"
                  value={`$ ${formatCurrencyCop(selectedDocument.totalDebtCapital)}`}
                />
                <DetailRow
                  label="Observaciones"
                  value={selectedDocument.description?.trim() || "Sin observaciones"}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => downloadDocument(selectedDocument.fileUrl)}
                  className="w-full rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af]"
                >
                  Descargar colilla de pago
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
