import { toast } from "sonner"

export async function downloadDocument(fileUrl: string) {
  try {
    const res = await fetch(
      `/api/documents/download?url=${encodeURIComponent(fileUrl)}`
    )

    if (!res.ok) {
      throw new Error("download_failed")
    }

    const blob = await res.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = fileUrl.split("/").pop() || "archivo"
    document.body.appendChild(a)
    a.click()

    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    toast.error("No se pudo descargar el archivo")
  }
}
