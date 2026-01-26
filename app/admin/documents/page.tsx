"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, FileText } from "lucide-react"
import { downloadDocument } from "@/lib/utils/downloadDocument"

type Document = {
  id: string
  fileType: string
  fileUrl: string
  description: string | null
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

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
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
                  <TableRow key={doc.id} className="hover:bg-gray-50">
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
                        onClick={() => downloadDocument(doc.fileUrl)}
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
    </div>
  )
}
